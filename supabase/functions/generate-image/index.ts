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
    // Validate content type
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType)
      throw new Error('Content-Type must be application/json')
    }

    // Safely parse JSON body
    let body
    try {
      const text = await req.text()
      console.log('Request body:', text) // Log raw request body
      body = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      throw new Error(`Invalid JSON body: ${parseError.message}`)
    }

    // Validate prompt
    const { prompt } = body
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt)
      throw new Error('Prompt must be a non-empty string')
    }

    console.log('Using prompt:', prompt)

    // Validate Hugging Face token
    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!token) {
      console.error('Hugging Face token not found')
      throw new Error('Configuration error: Missing API token')
    }

    const hf = new HfInference(token)

    console.log('Calling Hugging Face API')
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-2',
      parameters: {
        num_inference_steps: 25,
        guidance_scale: 7.5,
        width: 512,
        height: 512
      }
    })

    if (!image) {
      console.error('No image generated')
      throw new Error('No image generated from API')
    }

    console.log('Image generated, converting to base64')
    
    // Convert blob to base64 with error handling
    try {
      const arrayBuffer = await image.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      let binary = ''
      const chunkSize = 0x8000

      // Process the array in smaller chunks
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize)
        binary += String.fromCharCode.apply(null, chunk)
      }

      const base64 = btoa(binary)
      console.log('Successfully converted image to base64')

      return new Response(
        JSON.stringify({
          image: `data:image/png;base64,${base64}`,
          success: true
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (conversionError) {
      console.error('Error converting image:', conversionError)
      throw new Error(`Base64 conversion failed: ${conversionError.message}`)
    }
  } catch (error) {
    console.error('Error in generate-image function:', error)
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
    )
  }
})