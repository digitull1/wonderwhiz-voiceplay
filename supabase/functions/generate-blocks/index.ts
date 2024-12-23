import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const { query, context = "general", age_group = "8-12" } = await req.json();
    console.log('Generating content for:', { query, context, age_group });

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are WonderWhiz, a fun AI tutor for children aged ${age_group}.
    Create exactly 5 educational blocks about "${query}" formatted as a JSON object.
    
    Return ONLY a JSON object with this EXACT structure (no other text):
    {
      "blocks": [
        {
          "title": "🌟 [engaging title here, max 72 chars]",
          "description": "[two engaging sentences here]",
          "metadata": {
            "type": "fact",
            "topic": "${context}",
            "prompt": "[detailed prompt for content]"
          }
        },
        // ... 4 more similar blocks
      ]
    }

    Make each block unique:
    1. First block: type "fact" - a fascinating fact
    2. Second block: type "exploration" - deeper dive
    3. Third block: type "quiz-teaser" - teaser for quiz
    4. Fourth block: type "image" - for image generation
    5. Fifth block: type "quiz" - full quiz block

    Requirements:
    - Each title MUST start with an emoji
    - Keep titles under 72 characters
    - Make content fun and educational
    - Target age group: ${age_group}
    - Topic: ${query}

    IMPORTANT: Return ONLY the JSON object, no other text or explanation.`;

    console.log('Sending prompt to Gemini:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);

    let parsedResponse;
    try {
      // Clean the response - remove any markdown formatting
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      parsedResponse = JSON.parse(cleanText);
      
      // Validate response structure
      if (!parsedResponse?.blocks || !Array.isArray(parsedResponse.blocks)) {
        console.error('Invalid response structure:', parsedResponse);
        throw new Error('Invalid response structure');
      }

      // Ensure we have exactly 5 blocks
      if (parsedResponse.blocks.length !== 5) {
        console.error('Incorrect number of blocks:', parsedResponse.blocks.length);
        throw new Error('Incorrect number of blocks');
      }

      // Format and validate each block
      const types = ['fact', 'exploration', 'quiz-teaser', 'image', 'quiz'];
      const formattedBlocks = parsedResponse.blocks.map((block: any, index: number) => ({
        title: (block.title || "").substring(0, 72),
        description: block.description || "Click to explore more!",
        metadata: {
          type: types[index],
          topic: context,
          prompt: block.metadata?.prompt || `Tell me about ${block.title}`
        }
      }));

      return new Response(
        JSON.stringify({ blocks: formattedBlocks }),
        { headers: corsHeaders }
      );
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Failed response:', text);
      
      // Return fallback blocks
      const fallbackBlocks = {
        blocks: [
          {
            title: "🌟 Discover fascinating facts about " + context,
            description: "Learn amazing things about " + context + " that will blow your mind!",
            metadata: {
              type: "fact",
              topic: context,
              prompt: `Tell me fascinating facts about ${context}`
            }
          },
          {
            title: "🔍 Explore the mysteries of " + context,
            description: "Dive deeper into the fascinating world of " + context + "!",
            metadata: {
              type: "exploration",
              topic: context,
              prompt: `Explain ${context} in detail`
            }
          },
          {
            title: "💭 Test your knowledge about " + context,
            description: "Think you know everything about " + context + "? Let's find out!",
            metadata: {
              type: "quiz-teaser",
              topic: context,
              prompt: `Create a quiz about ${context}`
            }
          },
          {
            title: "🎨 Create amazing art about " + context,
            description: "Let's make something beautiful about " + context + "!",
            metadata: {
              type: "image",
              topic: context,
              prompt: `Generate a child-friendly illustration about ${context}`
            }
          },
          {
            title: "🎯 Challenge yourself with a " + context + " quiz",
            description: "Ready to become a " + context + " expert? Take this fun quiz!",
            metadata: {
              type: "quiz",
              topic: context,
              prompt: `Generate a fun quiz about ${context}`
            }
          }
        ]
      };

      return new Response(
        JSON.stringify(fallbackBlocks),
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to generate blocks',
        details: error.message
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});