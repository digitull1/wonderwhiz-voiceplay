import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateWithDallE(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    })
  });

  if (!response.ok) {
    throw new Error(`DALL-E API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].url;
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

    // Create a safe prompt for child-friendly content
    const safePrompt = `Create a child-friendly, educational illustration of: ${prompt}. Make it colorful and engaging for children.`
    console.log('Using safe prompt:', safePrompt)

    try {
      // First attempt with Hugging Face
      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
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
        throw new Error('No image generated from Hugging Face')
      }

      // Convert image to base64 safely
      const buffer = await image.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const base64 = btoa(String.fromCharCode.apply(null, bytes))
      const dataUrl = `data:image/jpeg;base64,${base64}`
      
      console.log('Image generated successfully with Hugging Face')
      
      return new Response(
        JSON.stringify({ 
          image: dataUrl,
          provider: 'huggingface',
          success: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (hfError) {
      console.log('Hugging Face generation failed, falling back to DALL-E:', hfError)
      
      // Fallback to DALL-E
      const imageUrl = await generateWithDallE(safePrompt)
      
      console.log('Image generated successfully with DALL-E')
      
      return new Response(
        JSON.stringify({ 
          image: imageUrl,
          provider: 'dalle',
          success: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in generate-image function:', error)
    
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
    )
  }
})