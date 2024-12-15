import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing generate-blocks request');
    const { query, context = "general", age_group = "8-12" } = await req.json();

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment');
      throw new Error('API key configuration missing');
    }

    // Parse age range for appropriate content
    const [minAge] = age_group.split('-').map(Number);
    console.log('Generating content for age:', minAge);

    // Generate blocks based on the guidelines
    const blocks = [
      {
        title: `🌟 Can ${context} really do that? Click to discover an amazing secret!`,
        description: "Uncover fascinating facts that will blow your mind!",
        metadata: {
          topic: context,
          type: "fact",
          prompt: `Tell me an amazing fact about ${context} that will surprise and delight children aged ${minAge}`
        }
      },
      {
        title: `🎨 Create magical ${context} art with AI!`,
        description: "Let's make something creative and colorful together!",
        metadata: {
          topic: context,
          type: "image",
          prompt: `Create a fun, child-friendly illustration about ${context}`
        }
      },
      {
        title: `🎯 Think you know everything about ${context}? Test your knowledge!`,
        description: "Challenge yourself with fun questions!",
        metadata: {
          topic: context,
          type: "quiz",
          prompt: `Generate engaging quiz questions about ${context} for children aged ${minAge}`
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
      JSON.stringify({ 
        error: 'Failed to generate blocks',
        details: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});