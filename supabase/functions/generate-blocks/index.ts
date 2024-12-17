import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store, no-cache, must-revalidate'
};

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
    const { query, context = "general" } = await req.json();
    console.log('Processing request:', { query, context });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
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

    const text = await retryWithBackoff(generateContent);
    console.log('Received response from Gemini:', text);

    let response;
    try {
      response = JSON.parse(text);
      console.log('Successfully parsed response');
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Invalid response format from Gemini');
    }

    return new Response(
      JSON.stringify(response),
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
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});