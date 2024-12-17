import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store, no-cache, must-revalidate'
};

const getFallbackBlocks = (topic: string = "general") => ({
  text: "Let's explore some amazing topics together! 🌟",
  blocks: [
    {
      title: "🌟 Discover fascinating facts about animals in our world!",
      metadata: {
        topic: "animals",
        type: "fact",
        prompt: "Tell me interesting facts about different animals"
      }
    },
    {
      title: "🔬 Learn about amazing science experiments you can try!",
      metadata: {
        topic: "science",
        type: "fact",
        prompt: "Share safe and fun science experiments for kids"
      }
    },
    {
      title: "🌍 Explore incredible places around the world!",
      metadata: {
        topic: "geography",
        type: "fact",
        prompt: "Tell me about interesting places and cultures"
      }
    },
    {
      title: "🎨 Create amazing artwork about nature!",
      metadata: {
        topic: "art",
        type: "image",
        prompt: "Generate a colorful, educational illustration about nature"
      }
    },
    {
      title: "🎯 Test your knowledge with a fun quiz!",
      metadata: {
        topic: "general",
        type: "quiz",
        prompt: "Generate an engaging quiz about general knowledge"
      }
    }
  ]
});

const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      
      // If we hit rate limit, return fallback immediately
      if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
        console.log('Rate limit hit, using fallback content');
        throw new Error('RATE_LIMIT');
      }
      
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
      console.log(`Retrying in ${delay}ms...`);
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
    const { query, context = "general" } = await req.json();
    console.log('Processing request:', { query, context });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify(getFallbackBlocks(context)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are WonderWhiz, a fun and curious AI tutor for kids.
    Generate engaging content about "${query}" in the context of "${context}".
    Make it educational, fun, and suitable for children.
    Include emojis and keep the language simple and clear.
    
    Format your response as a JSON object with this structure:
    {
      "text": "main response text with emojis",
      "blocks": [
        {
          "title": "engaging title with emoji",
          "metadata": {
            "topic": "specific topic",
            "type": "fact/image/quiz",
            "prompt": "detailed prompt for content generation"
          }
        }
      ]
    }`;

    console.log('Sending prompt to Gemini');
    
    const generateContent = async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    let text;
    try {
      text = await retryWithBackoff(generateContent);
      console.log('Received response from Gemini:', text);
    } catch (error) {
      if (error.message === 'RATE_LIMIT') {
        console.log('Using fallback content due to rate limit');
        return new Response(
          JSON.stringify(getFallbackBlocks(context)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }

    let response;
    try {
      response = typeof text === 'string' ? JSON.parse(text) : text;
      console.log('Successfully parsed response');
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return new Response(
        JSON.stringify(getFallbackBlocks(context)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blocks:', error);
    
    // Return fallback content with error details
    return new Response(
      JSON.stringify(getFallbackBlocks("general")),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});