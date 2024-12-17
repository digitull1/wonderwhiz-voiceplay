import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const RETRY_DELAY = 1000; // 1 second initial delay
const MAX_RETRIES = 3;

serve(async (req) => {
  console.log('Function called with method:', req.method);

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

    const { prompt, age_group = "8-12" } = await req.json();
    console.log('Processing image generation request:', { prompt, age_group });

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      console.error('HUGGING_FACE_ACCESS_TOKEN not configured');
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not configured');
    }

    // Create a safe prompt for child-friendly content
    const safePrompt = `Create a fun, cartoon-style image for kids that relates to: ${prompt}. 
      Style: Friendly, colorful, and kid-appropriate. Make it engaging and suitable for children aged ${age_group}.
      Include playful details and avoid anything scary or violent.
      Make it look like a high-quality children's book illustration.`;
    
    console.log('Using safe prompt:', safePrompt);

    const hf = new HfInference(token);
    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} of ${MAX_RETRIES}`);
        
        const image = await hf.textToImage({
          inputs: safePrompt,
          model: "stabilityai/stable-diffusion-2-1",
          parameters: {
            negative_prompt: "unsafe, inappropriate, scary, violent, adult content, realistic, photographic",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        });

        if (!image) {
          throw new Error('No image generated');
        }

        // Convert image to base64
        const buffer = await image.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        
        console.log('Image generated successfully');
        
        return new Response(
          JSON.stringify({ 
            image: dataUrl,
            success: true 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            } 
          }
        );
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        if (attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAY * Math.pow(2, attempt);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to generate image after all retries');
    
  } catch (error) {
    console.error('Error in generate-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Image generation failed', 
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