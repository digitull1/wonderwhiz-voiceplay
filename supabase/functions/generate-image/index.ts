import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RETRY_DELAY = 10000; // 10 seconds
const MAX_RETRIES = 3;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, age_group = "8-12" } = await req.json();
    console.log('Processing image generation request:', { prompt, age_group });

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not configured');
    }

    // Create a safe prompt for child-friendly content
    const safePrompt = `Create a child-friendly, educational illustration of: ${prompt}. 
      Make it colorful, engaging, and suitable for children aged ${age_group}.`;
    console.log('Using safe prompt:', safePrompt);

    const hf = new HfInference(token);

    // Implement retry logic with exponential backoff
    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} of ${MAX_RETRIES}`);
        
        const image = await hf.textToImage({
          inputs: safePrompt,
          model: "stabilityai/stable-diffusion-2-1",
          parameters: {
            negative_prompt: "unsafe, inappropriate, scary, violent, adult content",
            num_inference_steps: 25,
            guidance_scale: 7.5,
          }
        });

        if (!image) {
          throw new Error('No image generated');
        }

        // Convert image to base64
        const buffer = await image.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const base64 = btoa(String.fromCharCode(...Array.from(bytes)));
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
        
        // Check if it's a rate limit error
        if (error.message?.includes('Max requests')) {
          console.log(`Rate limit hit, waiting ${RETRY_DELAY}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        
        // For other errors, break the retry loop
        break;
      }
    }

    // If we get here, all retries failed
    throw lastError || new Error('Failed to generate image after retries');
    
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