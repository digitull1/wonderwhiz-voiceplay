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
    const { query, context = "general", age_group = "8-12", language = "en" } = await req.json();
    console.log('Generating content for:', { query, context, age_group });

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are WonderWhiz, a fun and educational AI assistant for children aged ${age_group}.
    Generate 5 engaging, educational blocks about "${query}" that follow these types:
    1. fact: A fascinating fact with a hook question
    2. exploration: A deeper dive into the topic
    3. quiz-teaser: A teaser for a fun quiz
    4. image: A prompt for generating a child-friendly illustration
    5. quiz: A full quiz about the topic

    Each block must have:
    - title (max 72 chars, include emoji)
    - description (2 engaging sentences)
    - metadata (type and topic)
    
    Make it fun, educational, and child-friendly!
    Format as a JSON array with exactly 5 blocks.`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();
    console.log('Generated content:', text);

    let blocks;
    try {
      blocks = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Invalid response format from Gemini');
    }

    // Validate and format blocks
    if (!blocks?.blocks || !Array.isArray(blocks.blocks) || blocks.blocks.length !== 5) {
      throw new Error('Invalid blocks format in response');
    }

    const formattedBlocks = blocks.blocks.map((block: any, index: number) => {
      const types = ['fact', 'exploration', 'quiz-teaser', 'image', 'quiz'];
      return {
        title: block.title?.substring(0, 72) || "",
        description: block.description || "Click to explore more!",
        metadata: {
          type: types[index], // Ensure correct type assignment
          topic: context,
          prompt: block.metadata?.prompt || `Tell me about ${block.title}`
        }
      };
    });

    return new Response(
      JSON.stringify({ blocks: formattedBlocks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating blocks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate blocks',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});