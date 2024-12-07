import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(operation: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      if (error.message?.includes('Rate limit reached')) {
        const waitTime = parseFloat(error.message.match(/try again in (\d+\.?\d*)s/)?.[1] || '1') * 1000;
        await wait(waitTime);
      } else {
        await wait(baseDelay * Math.pow(2, i));
      }
    }
  }
  throw lastError;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, age_group } = await req.json();
    console.log("Generating blocks for:", { query, context, age_group });

    const ageSpecificInstructions = `
      For ${age_group} year olds:
      - Use simple, clear language they can understand
      - Include relatable examples from their daily life
      - Make comparisons to things they know (toys, games, school)
      - Keep explanations brief but engaging
      - Use a friendly, encouraging tone
      - Include fun facts that spark curiosity
      - Avoid complex terminology unless explained simply
    `;

    const prompt = `
      Based on "${query}" and topic "${context}", generate 5 engaging, educational blocks following these guidelines:
      
      ${ageSpecificInstructions}
      
      RULES:
      1. Each block must be EXACTLY ONE LINE and UNDER 70 CHARACTERS (including emoji)
      2. First 3 blocks MUST:
         - Start with an exciting question or "Want to know..."
         - Include ONE fascinating fact with a silly comparison
         - End with ONE relevant emoji
         - Be engaging for kids aged ${age_group}
         - Use warm, playful language
      3. 4th block MUST:
         - Start with "Want to see..."
         - Choose ONE of these styles randomly:
           * Realistic: "a detailed photograph of..."
           * Cartoon: "a cute cartoon illustration of..."
           * Printable: "a simple black and white outline of..."
         - Include whimsical elements (e.g., "a penguin wearing a top hat")
         - End with 🎨 emoji
      4. 5th block MUST:
         - Start with "Ready to test your knowledge..."
         - Make it fun and exciting with a silly twist
         - End with 🎯 emoji
      5. MAINTAIN TOPIC RELEVANCE:
         - Each block must naturally continue the current topic
         - Focus on related subtopics
         - Ensure logical connections between blocks
      6. TONE & STYLE:
         - Be warm and enthusiastic
         - Use simple, kid-friendly language
         - Add light humor or silly comparisons
         - Celebrate curiosity
      7. NO undefined values or spelling mistakes allowed
      8. DO NOT include phrases like 'Click to explore more'
      9. ENSURE each block fits on ONE line and is UNDER 70 characters

      Format response as:
      {
        "blocks": [
          {
            "title": "Single line of exactly 70 chars or less with emoji",
            "metadata": {
              "topic": "specific_subtopic_related_to_context",
              "type": "fact|image|quiz"
            }
          }
        ]
      }
    `;

    const makeRequest = async () => {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: "You are WonderWhiz, generating exciting educational content for kids. Be warm, playful, and encouraging!"
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log("Raw response:", data);

      const parsedContent = typeof data.choices[0].message.content === 'string' 
        ? JSON.parse(data.choices[0].message.content)
        : data.choices[0].message.content;

      if (!Array.isArray(parsedContent?.blocks)) {
        throw new Error("Invalid blocks format in response");
      }

      parsedContent.blocks = parsedContent.blocks.map(block => ({
        title: block.title?.trim().replace(/undefined|null/g, '').replace(/Click to explore more/gi, '') || 
               "Want to know something amazing? Let's explore! ✨",
        metadata: {
          topic: block.metadata?.topic || context,
          type: block.metadata?.type || "fact"
        }
      }));

      return data;
    };

    const data = await retryWithBackoff(makeRequest);
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate blocks', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});