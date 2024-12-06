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
    const { prompt } = await req.json()
    console.log('Generating image for prompt:', prompt)

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Image generation timed out')), 30000)
    })

    const imagePromise = hf.textToImage({
      inputs: prompt || "A magical educational scene",
      model: 'black-forest-labs/FLUX.1-schnell',
      parameters: {
        num_inference_steps: 30,  // Reduced for better performance
        guidance_scale: 7.5
      }
    })

    const image = await Promise.race([imagePromise, timeoutPromise])
    console.log('Image generated successfully')

    // Convert the blob to base64 more efficiently
    const arrayBuffer = await image.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const chunks = []
    const chunkSize = 0x8000

    // Process the array in smaller chunks to prevent stack overflow
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      chunks.push(String.fromCharCode.apply(null, 
        uint8Array.subarray(i, i + chunkSize)))
    }

    const base64 = btoa(chunks.join(''))
    console.log('Image converted to base64 successfully')

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-image function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})