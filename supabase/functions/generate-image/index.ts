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
    
    // Parse and validate request body
    let body;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      body = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({
          error: 'Invalid request format',
          details: 'Request body must be valid JSON',
          success: false
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Parsed request body:', body);

    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt',
          details: 'Prompt must be a non-empty string',
          success: false
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Processing prompt:', prompt);

    // Check if we have the Hugging Face token
    const hfToken = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    if (!hfToken) {
      console.error('Hugging Face token not found');
      return new Response(
        JSON.stringify({
          error: 'Configuration error',
          details: 'Hugging Face token not configured',
          success: false
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Call Hugging Face API
    const hf = new HfInference(hfToken);
    try {
      console.log('Calling Hugging Face API with model: stabilityai/stable-diffusion-2');
      const image = await hf.textToImage({
        inputs: prompt,
        model: "stabilityai/stable-diffusion-2",
        parameters: {
          negative_prompt: "blurry, bad quality, distorted",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      });

      if (!image) {
        throw new Error('No image generated from Hugging Face API');
      }

      // Convert to base64
      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      console.log('Image generated successfully');

      return new Response(
        JSON.stringify({
          image: `data:image/png;base64,${base64}`,
          success: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Hugging Face API error:', error);
      
      // Check if it's a rate limit error
      if (error.message?.includes('Max requests') || error.message?.includes('rate limit')) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            details: error.message,
            success: false,
            isRateLimit: true
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429 // Too Many Requests
          }
        );
      }
      
      throw error; // Re-throw other errors to be caught by outer catch block
    }
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