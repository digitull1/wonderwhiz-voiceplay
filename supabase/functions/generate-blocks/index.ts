import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { callGroq } from "../_shared/groq.ts"
import { generateAgeSpecificInstructions, buildPrompt } from "./prompts.ts"
import { parseGroqResponse, validateBlocksStructure } from "../_shared/jsonParser.ts"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { query, context, age_group = "8-11" } = await req.json();
    console.log('Processing request with params:', { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = generateAgeSpecificInstructions(age_group);
    const prompt = buildPrompt(query, context, ageSpecificInstructions);
    
    console.log('Making request to Groq API with prompt:', prompt);
    
    const data = await callGroq([
      {
        role: "system",
        content: `You are WonderWhiz, generating exciting educational content for kids aged ${age_group}. Always respond with valid JSON containing an array of blocks.`
      },
      { role: "user", content: prompt }
    ], 0.7, 500, 5);

    if (!data?.choices?.[0]?.message?.content) {
      console.error('Invalid response format from Groq API:', data);
      throw new Error('Invalid response format from Groq API');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content from Groq:', content);

    let parsedContent;
    try {
      // Parse and validate the response
      parsedContent = parseGroqResponse(content);
      parsedContent = validateBlocksStructure(parsedContent);
      
      // Ensure each block has required fields and limit to 3 blocks
      parsedContent.blocks = parsedContent.blocks.slice(0, 3).map(block => ({
        title: block.title?.substring(0, 75) || "Interesting fact!",
        metadata: {
          topic: block.metadata?.topic || context || "general",
          type: block.metadata?.type || "fact"
        }
      }));

      // Add image and quiz blocks
      parsedContent.blocks.push(
        {
          title: `🎨 Create amazing ${context} artwork!`,
          metadata: {
            topic: context,
            type: "image"
          }
        },
        {
          title: `🎯 Test your ${context} knowledge!`,
          metadata: {
            topic: context,
            type: "quiz"
          }
        }
      );

      console.log('Final blocks structure:', parsedContent);

    } catch (error) {
      console.error('Error parsing or processing content:', error);
      throw new Error(`Failed to process Groq response: ${error.message}`);
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
    // Return a fallback response with basic blocks
    const fallbackResponse = {
      blocks: [
        {
          title: "Let's learn something new!",
          metadata: {
            topic: "general",
            type: "fact"
          }
        },
        {
          title: "🎨 Create some artwork!",
          metadata: {
            topic: "general",
            type: "image"
          }
        },
        {
          title: "🎯 Test your knowledge!",
          metadata: {
            topic: "general",
            type: "quiz"
          }
        }
      ]
    };
    
    return new Response(
      JSON.stringify(fallbackResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 with fallback content instead of 500
      }
    );
  }
});