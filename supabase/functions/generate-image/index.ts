import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting image generation request');
    
    // Get and validate the request body
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      throw new Error('Invalid prompt format');
    }

    console.log('Processing prompt:', prompt);

    // Initialize Hugging Face with access token
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
    if (!hf) {
      throw new Error('Failed to initialize Hugging Face client');
    }

    console.log('Generating image with Hugging Face');
    const image = await hf.textToImage({
      inputs: prompt,
      model: "stabilityai/stable-diffusion-2",
      parameters: {
        negative_prompt: "blurry, bad quality, distorted",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        width: 512,
        height: 512
      }
    });

    if (!image) {
      console.error('No image generated');
      throw new Error('No image generated from API');
    }

    console.log('Image generated successfully, converting to base64');
    
    // Convert blob to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return new Response(
      JSON.stringify({
        image: `data:image/png;base64,${base64}`,
        success: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate image',
        details: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})