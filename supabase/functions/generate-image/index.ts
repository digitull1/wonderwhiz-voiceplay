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
    const { prompt, age_group } = await req.json()
    console.log('Processing image generation request:', { prompt, age_group })

    if (!prompt) {
      console.error('No prompt provided')
      throw new Error('No prompt provided')
    }

    // Initialize Hugging Face with access token
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    // Create a safe prompt for child-friendly content
    const safePrompt = `Create a child-friendly, educational illustration of: ${prompt}`
    console.log('Using safe prompt:', safePrompt)

    // Generate image with explicit parameters
    const image = await hf.textToImage({
      inputs: safePrompt,
      model: "stabilityai/stable-diffusion-2-1",
      parameters: {
        negative_prompt: "unsafe, inappropriate, scary, violent, adult content",
        num_inference_steps: 25,
        guidance_scale: 7.5,
      }
    })

    if (!image) {
      console.error('No image generated')
      throw new Error('Failed to generate image')
    }

    // Convert image to base64 safely
    let base64: string
    try {
      const buffer = await image.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      base64 = btoa(String.fromCharCode.apply(null, bytes))
    } catch (conversionError) {
      console.error('Error converting image:', conversionError)
      throw new Error('Failed to process generated image')
    }

    const dataUrl = `data:image/jpeg;base64,${base64}`
    console.log('Image generated and converted successfully')
    
    return new Response(
      JSON.stringify({ 
        image: dataUrl,
        success: true 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-image function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Image generation failed', 
        details: error.message,
        success: false
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})