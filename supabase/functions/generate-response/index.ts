import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (error.message?.includes('Rate limit reached')) {
        const waitTime = parseFloat(error.message.match(/try again in (\d+\.?\d*)s/)?.[1] || '1') * 1000;
        console.log(`Rate limit hit, waiting for ${waitTime}ms before retry ${i + 1}`);
        await wait(waitTime);
      } else {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Operation failed, retrying in ${delay}ms (attempt ${i + 1})`);
        await wait(delay);
      }
    }
  }
  
  throw lastError;
}

function getAgeAppropriatePrompt(age: number, prompt: string) {
  if (age <= 8) {
    return `Imagine you're talking to a ${age}-year-old child. Use simple words, fun examples, and a friendly tone. Add emojis to make it engaging! Here's their question: ${prompt}`;
  } else if (age <= 12) {
    return `You're explaining this to a ${age}-year-old. Use clear examples and interesting facts, but keep it fun and engaging. Include some emojis! The question is: ${prompt}`;
  } else {
    return `You're talking to a ${age}-year-old teen. Use age-appropriate examples and interesting details. Keep it engaging but not too childish. The question is: ${prompt}`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, max_words = 300, age = 10, conversation_history = [] } = await req.json()
    console.log('Generating response for prompt:', prompt, 'with max words:', max_words, 'for age:', age)

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) {
      console.error('Groq API key not found')
      throw new Error('Groq API key not configured')
    }

    const makeRequest = async () => {
      const contextPrompt = conversation_history.length > 0 
        ? `Previous context: ${conversation_history.join(" -> ")}\n\nCurrent question: ${prompt}`
        : prompt;

      const ageAppropriatePrompt = getAgeAppropriatePrompt(age, contextPrompt);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `You are WonderWhiz, an exciting AI tutor that makes learning fun for kids!
              Structure your responses in three clear paragraphs:
              1. Start with a direct, engaging answer
              2. Add interesting details, examples, or fun facts
              3. End with a summary and an engaging question to keep the conversation going

              Guidelines:
              1. Keep each paragraph clear and focused
              2. Use age-appropriate language and examples
              3. Include emojis naturally throughout the response
              4. Maintain conversation context when relevant
              5. Stay under ${max_words} words total
              6. Never include undefined or null
              7. Double-check spelling and grammar
              8. Always capitalize the first letter of every sentence
              9. End with an engaging question related to the topic`
            },
            {
              role: "user",
              content: ageAppropriatePrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Groq API Error:", error);
        throw new Error(error.error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log("Raw response from Groq:", data);
      
      const content = data.choices[0]?.message?.content || "";
      if (!content) {
        throw new Error("Empty response from Groq");
      }

      // Clean up the response
      const cleanedContent = content
        .replace(/undefined|null/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      data.choices[0].message.content = cleanedContent;
      return data;
    };

    const data = await retryWithBackoff(makeRequest);
    console.log("Final processed response:", data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
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