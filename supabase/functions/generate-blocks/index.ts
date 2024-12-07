import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility function to wait for a specified time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  baseDelay = 1000,
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // If it's a rate limit error, wait for the specified time
      if (error.message?.includes('Rate limit reached')) {
        const waitTime = parseFloat(error.message.match(/try again in (\d+\.?\d*)s/)?.[1] || '1') * 1000;
        console.log(`Rate limit hit, waiting for ${waitTime}ms before retry ${i + 1}`);
        await wait(waitTime);
      } else {
        // For other errors, use exponential backoff
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Operation failed, retrying in ${delay}ms (attempt ${i + 1})`);
        await wait(delay);
      }
    }
  }
  
  throw lastError;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, context, age_group, name, previous_response } = await req.json()
    console.log("Generating blocks for:", { query, context, age_group, name, previous_response });

    const apiKey = Deno.env.get('GROQ_API_KEY') || Deno.env.get('Groq');
    if (!apiKey) {
      console.error('Neither GROQ_API_KEY nor Groq secret is set');
      throw new Error('Groq API key not configured');
    }

    const prompt = `
      Based on this chat message: "${query}" and the current topic "${context}",
      generate 3 engaging, educational blocks that are DIRECTLY RELATED to the current topic.
      Previous response for context: "${previous_response}"

      IMPORTANT FORMATTING AND CONTEXT RULES:
      1. Each block must be EXACTLY ONE LINE of clickbait-style content
      2. Each line MUST be EXACTLY 75 CHARACTERS or LESS (including spaces and emoji)
      3. Each line MUST:
         - Start with "Did you know" or an exciting question
         - Include ONE fascinating fact DIRECTLY RELATED to the current topic
         - End with ONE relevant emoji
         - Be engaging and fun for kids
         - Make them want to click to learn more
      4. MAINTAIN TOPIC RELEVANCE:
         - Each block must be a natural continuation of the current topic
         - Focus on related subtopics that expand on the current discussion
         - Ensure a logical connection between blocks

      Example perfect blocks for "planets":
      - "Did you know Mars has the biggest volcano in our solar system? Let's explore it! 🌋"
      - "Want to see why Saturn's rings are disappearing? Time to blast off! 🚀"
      - "Can you believe Venus spins backwards? Let's find out why! ⭐"

      Format the response as a JSON object with this structure:
      {
        "blocks": [
          {
            "title": "Single line of exactly 75 chars or less with emoji",
            "metadata": {
              "topic": "specific_subtopic_related_to_context"
            }
          }
        ]
      }

      CRITICAL: 
      - Double-check that each title is 75 characters or less INCLUDING the emoji!
      - Ensure each block is directly related to the current topic!
      - Build upon the previous response to maintain conversation flow!
    `

    console.log("Sending request to Groq API with prompt:", prompt);

    const makeRequest = async () => {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `You are WonderWhiz, an exciting AI tutor that makes learning feel like an adventure!
              Your task is to generate EXACTLY 3 blocks of content that:
              1. Are EXACTLY 75 characters or less (including spaces and emoji)
              2. Use simple language for kids
              3. Include ONE relevant emoji at the end
              4. Make kids curious to learn more
              5. Follow the clickbait-style format perfectly
              6. MUST be directly related to the current topic
              7. Build upon previous responses to maintain context`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Groq API Error:", error);
        
        // Enhanced error handling for rate limits
        if (error.error?.message?.includes('Rate limit reached')) {
          throw new Error(error.error.message);
        }
        
        throw new Error(error.error?.message || "Failed to get response from Groq");
      }

      return await response.json();
    };

    // Use the retry function for the API call
    const data = await retryWithBackoff(makeRequest);
    console.log("Generated blocks:", data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    
    // Provide more informative error messages
    const errorMessage = error.message?.includes('Rate limit reached')
      ? 'Service is temporarily busy. Please try again in a few seconds.'
      : error.message;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
})