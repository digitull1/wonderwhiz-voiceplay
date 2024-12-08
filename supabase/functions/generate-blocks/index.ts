import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getAgeSpecificInstructions(ageGroup: string): string {
  const [minAge, maxAge] = ageGroup.split('-').map(Number);
  
  if (minAge >= 5 && maxAge <= 7) {
    return `
      For young explorers (${ageGroup} years):
      - Use very simple, playful language with basic words
      - Start blocks with fun questions like "Do stars have bedtime stories?" or "Want to know a magical secret?"
      - Include magical and wonder-filled words (magical, amazing, sparkly, fantastic)
      - Make comparisons to familiar things like toys, treats, or pets
      - Keep sentences short and exciting with lots of "!"
      - Add fun, friendly emojis that match the content
      - Focus on basic, fascinating facts that spark joy
      - Make everything sound like a magical adventure
      - Block 4 MUST start with "Want to see a cute picture of..." and end with 🎨
      - Block 5 MUST start with "Ready for a fun quiz about..." and end with 🎯
      - Use words like "magical", "amazing", "super fun", "incredible"
      - Keep vocabulary simple and familiar
      - Add playful elements like "Wow!" or "Guess what?"
    `;
  } else if (minAge >= 8 && maxAge <= 11) {
    return `
      For curious minds (${ageGroup} years):
      - Use clear language with some interesting vocabulary
      - Start blocks with intriguing questions like "Did you know..." or "Ever wondered..."
      - Include relatable examples from school, games, or daily life
      - Add silly comparisons that make learning fun
      - Mix in some playful jokes and puns
      - Use emojis that add meaning to the content
      - Focus on the 'how' and 'why' of things
      - Make everything sound like an exciting discovery
      - Block 4 MUST start with "Want to see a cool picture of..." and end with 🎨
      - Block 5 MUST start with "Think you know about..." and end with 🎯
      - Use words like "awesome", "fascinating", "incredible", "mind-blowing"
      - Include some scientific terms with simple explanations
      - Add interactive elements like "Let's explore!" or "Ready to discover?"
    `;
  } else {
    return `
      For young scientists (${ageGroup} years):
      - Use more sophisticated language while keeping it engaging
      - Start blocks with thought-provoking questions or "Ever considered..."
      - Include real-world applications and scientific concepts
      - Add interesting facts and connections to other topics
      - Use cool analogies that respect their intelligence
      - Choose emojis that complement the scientific content
      - Focus on deeper understanding and connections
      - Make everything sound like scientific exploration
      - Block 4 MUST start with "Let's visualize..." and end with 🎨
      - Block 5 MUST start with "Ready to test your knowledge about..." and end with 🎯
      - Use proper scientific terms with clear explanations
      - Include references to current scientific discoveries
      - Add challenges like "Can you explain why..." or "What would happen if..."
    `;
  }
}

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
  // Log incoming request
  console.log(`Received ${req.method} request to generate-blocks`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Parse request body
    const { query, context, age_group = "8-11" } = await req.json();
    console.log("Generating blocks for:", { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = getAgeSpecificInstructions(age_group);

    const prompt = `
      Based on "${query}" and topic "${context}", generate 5 engaging, educational blocks following these guidelines:
      
      ${ageSpecificInstructions}
      
      RULES:
      1. Each block must be EXACTLY ONE LINE and UNDER 70 CHARACTERS (including emoji)
      2. First 3 blocks MUST:
         - Each explore a DIFFERENT aspect of the topic
         - Start with an exciting question or "Want to know..."
         - Include ONE fascinating fact with a silly comparison
         - End with ONE relevant emoji
         - Be engaging for kids aged ${age_group}
         - Use warm, playful language
      3. 4th block MUST:
         - Follow age-specific image prompt format
         - Choose ONE of these styles based on age:
           * Ages 5-7: "Want to see a cute picture of..."
           * Ages 8-11: "Want to see a cool picture of..."
           * Ages 12-16: "Let's visualize..."
         - End with 🎨 emoji
      4. 5th block MUST:
         - Follow age-specific quiz prompt format
         - Make it fun and exciting
         - End with 🎯 emoji
      5. MAINTAIN TOPIC RELEVANCE:
         - Each block must explore a DIFFERENT aspect of the current topic
         - Focus on related but distinct subtopics
         - Ensure logical progression between blocks
      6. TONE & STYLE:
         - Match the age-specific tone perfectly
         - Use language appropriate for ${age_group} year olds
         - Add light humor or silly comparisons
         - Celebrate curiosity
      7. NO undefined values or spelling mistakes allowed
      8. DO NOT include phrases like 'Click to explore more'
      9. ENSURE each block fits on ONE line and is UNDER 70 characters

      Example for "Eiffel Tower in summer":
      Block 1: "Ever wondered why the Eiffel Tower gets taller in summer? 🌡️"
      Block 2: "Want to know how engineers measure the tower's height changes? 📏"
      Block 3: "Did you know other buildings grow too? It's like a city yoga stretch! 🏙️"
      Block 4: "Want to see a cool picture of the Eiffel Tower's summer growth? 🎨"
      Block 5: "Ready to test your knowledge about expanding landmarks? 🎯"

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
      console.log('Making request to Groq API');
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
              content: `You are WonderWhiz, generating exciting educational content for kids aged ${age_group}. Be warm, playful, and encouraging!`
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(errorData.error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log("Received response from Groq API");

      const parsedContent = typeof data.choices[0].message.content === 'string' 
        ? JSON.parse(data.choices[0].message.content)
        : data.choices[0].message.content;

      if (!Array.isArray(parsedContent?.blocks)) {
        throw new Error("Invalid blocks format in response");
      }

      parsedContent.blocks = parsedContent.blocks.map((block: any, index: number) => ({
        title: block.title?.trim().replace(/undefined|null/g, '').replace(/Click to explore more/gi, '') || 
               "Want to know something amazing? Let's explore! ✨",
        metadata: {
          topic: block.metadata?.topic || context,
          type: index === 3 ? "image" : index === 4 ? "quiz" : "fact"
        }
      }));

      return data;
    };

    const data = await retryWithBackoff(makeRequest);
    console.log('Successfully generated blocks');

    return new Response(JSON.stringify(data), { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate blocks', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }, 
        status: 500
      }
    );
  }
});