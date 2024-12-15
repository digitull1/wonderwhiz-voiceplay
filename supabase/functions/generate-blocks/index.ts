import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context = "general", age_group = "8-12" } = await req.json();
    console.log('Generating blocks for:', { query, context, age_group });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are WonderWhiz, a fun and curious AI tutor for kids aged ${age_group}.
    Generate 5 engaging content blocks about "${context}" based on "${query}".
    For each block:
    - Title: Max 72 characters, must be a clickbait-style question or fascinating fact with emoji
    - Description: Short teaser that makes kids want to click
    - Type: Alternate between 'fact', 'image', and 'quiz'
    
    Return as a JSON object with this structure:
    {
      "blocks": [
        {
          "title": "engaging question/fact with emoji",
          "description": "teaser text",
          "metadata": {
            "topic": "specific topic",
            "type": "fact/image/quiz",
            "prompt": "detailed prompt for content generation"
          }
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Generated content:', text);

    let blocks;
    try {
      blocks = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Fallback blocks with proper structure
      blocks = {
        blocks: [
          {
            title: `🌟 Discover amazing secrets about ${context}!`,
            description: "Click to uncover fascinating facts that will blow your mind!",
            metadata: {
              topic: context,
              type: "fact",
              prompt: `Tell me an amazing fact about ${context} that will surprise and delight children aged ${age_group}`
            }
          },
          {
            title: `🔬 Explore the hidden wonders of ${context}!`,
            description: "Join me on an exciting journey of discovery!",
            metadata: {
              topic: context,
              type: "fact",
              prompt: `Share an exciting discovery about ${context} that children aged ${age_group} would love`
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
            title: `🌈 Uncover the rainbow connection in ${context}!`,
            description: "Did you know there's something amazing waiting to be discovered?",
            metadata: {
              topic: context,
              type: "fact",
              prompt: `Share a colorful and engaging fact about ${context} for children aged ${age_group}`
            }
          },
          {
            title: `🎯 Test your ${context} knowledge!`,
            description: "Challenge yourself with fun questions!",
            metadata: {
              topic: context,
              type: "quiz",
              prompt: `Generate engaging quiz questions about ${context} for children aged ${age_group}`
            }
          }
        ]
      };
    }

    return new Response(
      JSON.stringify(blocks),
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