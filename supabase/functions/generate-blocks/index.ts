import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store, no-cache, must-revalidate'
};

const getFallbackBlocks = (topic: string, context: string) => ({
  blocks: [
    {
      title: `🌟 Discover Amazing Facts About ${topic}!`,
      description: "Click to uncover fascinating secrets!",
      metadata: {
        topic: context,
        type: "fact",
        prompt: `Tell me fascinating facts about ${topic} that would amaze children`
      }
    },
    {
      title: `🎨 Create a Magical ${topic} Scene!`,
      description: "Let's make something creative together!",
      metadata: {
        topic: context,
        type: "image",
        prompt: `Create a fun, educational illustration about ${topic}`
      }
    },
    {
      title: `🎯 Test Your ${topic} Knowledge!`,
      description: "Are you ready for an exciting challenge?",
      metadata: {
        topic: context,
        type: "quiz",
        prompt: `Generate engaging quiz questions about ${topic}`
      }
    }
  ]
});

const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

serve(async (req) => {
  console.log('Function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const { query, context = "general", age_group = "8-12" } = await req.json();
    console.log('Processing request with:', { query, context, age_group });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      throw new Error('API configuration error');
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are WonderWhiz, a fun and curious AI tutor for kids aged ${age_group}.
    Generate 3 engaging content blocks about "${context}" based on "${query}".
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

    try {
      console.log('Sending prompt to Gemini');
      const generateContent = async () => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      };

      const text = await retryWithBackoff(generateContent);
      console.log('Received response from Gemini:', text);

      let blocks;
      try {
        blocks = JSON.parse(text);
        console.log('Successfully parsed response');
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.log('Using fallback blocks due to parse error');
        blocks = getFallbackBlocks(query, context);
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

    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      
      // Check if it's a rate limit error
      if (geminiError.message?.includes('429') || geminiError.message?.includes('quota')) {
        console.log('Rate limit reached, using fallback blocks');
        const fallbackBlocks = getFallbackBlocks(query, context);
        
        return new Response(
          JSON.stringify(fallbackBlocks),
          { 
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      throw geminiError;
    }

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