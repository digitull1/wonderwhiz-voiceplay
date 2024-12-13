import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { callGroq } from "../_shared/groq.ts"
import { generateAgeSpecificInstructions, buildPrompt } from "./prompts.ts"
import { parseGroqResponse, validateBlocksStructure } from "../_shared/jsonParser.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

console.log('Loading generate-blocks function...');

const generateWithGemini = async (prompt: string) => {
  console.log('Attempting to generate blocks with Gemini...');
  
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  console.log('Gemini response:', result);

  if (!result?.response) {
    throw new Error('Empty response from Gemini API');
  }

  return result.response.text();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      } 
    });
  }

  try {
    console.log('Processing request...');
    
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { query, context, age_group = "8-11" } = await req.json();
    console.log('Request parameters:', { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = generateAgeSpecificInstructions(age_group);
    const prompt = buildPrompt(query, context, ageSpecificInstructions);
    
    let content;
    try {
      console.log('Attempting Groq API first...');
      const data = await callGroq([
        {
          role: "system",
          content: `You are WonderWhiz, generating exciting educational content for kids aged ${age_group}. Always respond with valid JSON containing an array of blocks.`
        },
        { role: "user", content: prompt }
      ], 0.7, 500, 2);

      content = data.choices[0]?.message?.content;
    } catch (groqError) {
      console.error('Groq API failed, falling back to Gemini:', groqError);
      content = await generateWithGemini(prompt);
    }

    if (!content) {
      console.error('No content received from either API');
      throw new Error('Failed to generate content');
    }

    console.log('Raw content received:', content);

    let parsedContent;
    try {
      parsedContent = parseGroqResponse(content);
      parsedContent = validateBlocksStructure(parsedContent);
      
      parsedContent.blocks = parsedContent.blocks.slice(0, 3).map(block => ({
        title: block.title?.substring(0, 75) || "Interesting fact!",
        metadata: {
          topic: block.metadata?.topic || context || "general",
          type: block.metadata?.type || "fact"
        }
      }));

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

      return new Response(
        JSON.stringify(parsedContent),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          status: 200
        }
      );

    } catch (error) {
      console.error('Error parsing or processing content:', error);
      throw new Error(`Failed to process response: ${error.message}`);
    }

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        status: 200
      }
    );
  }
});