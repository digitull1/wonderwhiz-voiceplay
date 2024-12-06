import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    console.log('Generating image for prompt:', prompt)

    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_TOKEN')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`)
    }

    const imageBlob = await response.blob()
    const base64Image = `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(await imageBlob.arrayBuffer())))}`

    return new Response(
      JSON.stringify({ image: base64Image }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})