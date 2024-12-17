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
    const { prompt, context } = await req.json();
    console.log('Generating content with prompt:', { prompt, context });

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are WonderWhiz, a fun and educational AI assistant for children.
    Your task is to generate engaging, age-appropriate content for a ${context.age}-year-old child.
    Keep the language simple, fun, and educational.
    Include emojis to make it more engaging.
    Always end with a question to encourage curiosity.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);

    const response = result.response;
    const text = response.text();
    console.log('Generated content:', text);

    return new Response(
      JSON.stringify({ text, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating content:', error);
    
    // Check if it's a rate limit error
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      const fallbackText = "I'm a bit tired right now, but I'd love to tell you more about this topic! What would you like to know? 🌟";
      
      return new Response(
        JSON.stringify({ text: fallbackText, success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
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