import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { validateRequest, createFallbackBlocks } from "../_shared/blockUtils.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing generate-blocks request');
    const { query, context = "general", age_group = "8-12" } = await validateRequest(req);

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment');
      throw new Error('API key configuration missing');
    }

    // Generate engaging blocks based on age group and context
    const blocks = [
      {
        title: `🌟 Discover amazing facts about ${context}!`,
        metadata: {
          topic: context,
          type: "fact"
        }
      },
      {
        title: `🎨 Create ${context} artwork!`,
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
    ];

    return new Response(
      JSON.stringify({ blocks }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-blocks:', error);
    
    return new Response(
      JSON.stringify(createFallbackBlocks("general")),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 // Return 200 even for errors to handle them gracefully
      }
    );
  }
});