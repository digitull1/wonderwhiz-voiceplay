import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("HUGGING_FACE_ACCESS_TOKEN")}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Hugging Face API error:', await response.text());
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    // Get the image data
    const imageData = await response.arrayBuffer();
    if (!imageData || imageData.byteLength === 0) {
      throw new Error('No image data received from API');
    }

    // Convert to base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageData)));
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