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
    // Log the raw request for debugging
    console.log('Received request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Get the raw request body first
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Validate Content-Type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    // Parse JSON body with error handling
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid request format',
          details: 'Request body must be valid JSON',
          success: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Validate the prompt
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log('Processing prompt:', prompt);

    // Validate Hugging Face token
    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      console.error('Hugging Face token not found');
      return new Response(
        JSON.stringify({
          error: 'Configuration error',
          details: 'Missing API token',
          success: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const hf = new HfInference(token);

    console.log('Calling Hugging Face API');
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-2',
      parameters: {
        num_inference_steps: 25,
        guidance_scale: 7.5,
        width: 512,
        height: 512
      }
    });

    if (!image) {
      console.error('No image generated');
      throw new Error('No image generated from API');
    }

    console.log('Image generated, converting to base64');
    
    // Convert blob to base64 with error handling
    try {
      const arrayBuffer = await image.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 0x8000;

      // Process the array in smaller chunks
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }

      const base64 = btoa(binary);
      console.log('Successfully converted image to base64');

      return new Response(
        JSON.stringify({
          image: `data:image/png;base64,${base64}`,
          success: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (conversionError) {
      console.error('Error converting image:', conversionError);
      return new Response(
        JSON.stringify({
          error: 'Image processing error',
          details: conversionError.message,
          success: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
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