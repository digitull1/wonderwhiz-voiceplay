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
    console.log('Generating image for prompt:', prompt, 'age group:', age_group)

    if (!prompt) {
      throw new Error('No prompt provided')
    }

    // Initialize Hugging Face with access token
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    // Ensure the prompt is safe for the age group
    const safePrompt = `Create a child-friendly, educational illustration of: ${prompt}`
    console.log('Using safe prompt:', safePrompt)

    // Generate image using Hugging Face's text-to-image model
    const image = await hf.textToImage({
      inputs: safePrompt,
      model: "stabilityai/stable-diffusion-2-1",
      parameters: {
        negative_prompt: "unsafe, inappropriate, scary, violent, adult content",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    })

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const dataUrl = `data:image/jpeg;base64,${base64}`

    console.log('Image generated successfully')
    
    return new Response(
      JSON.stringify({ image: dataUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
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