import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, age_group = "8-12" } = await req.json();
    console.log('Generating image for prompt:', prompt, 'age group:', age_group);

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt provided');
    }

    // Format the prompt based on age group
    let stylePrompt = "";
    const [minAge] = age_group.split('-').map(Number);
    
    if (minAge <= 7) {
      stylePrompt = "cute, friendly cartoon style, very simple, colorful, and playful";
    } else if (minAge <= 11) {
      stylePrompt = "colorful illustration style, engaging, educational, with fun details";
    } else {
      stylePrompt = "detailed educational illustration, realistic yet engaging, with scientific accuracy";
    }

    // Format the prompt to be age-appropriate and educational
    const formattedPrompt = `Create a ${stylePrompt} illustration of: ${prompt.slice(0, 200)}. 
      Make it safe and suitable for children aged ${age_group}. 
      Focus on educational value while maintaining visual appeal.`.slice(0, 500);
    
    console.log('Formatted prompt:', formattedPrompt);

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: formattedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({ 
        image: data.data[0].url,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message,
        success: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});