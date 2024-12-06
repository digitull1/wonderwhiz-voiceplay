import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, prompt } = await req.json()
    console.log('Analyzing image with prompt:', prompt)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are WonderWhiz, an enthusiastic and friendly AI tutor for kids. Analyze images and provide engaging, educational responses with emojis and simple language."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt || "What's in this image? Explain it in a fun, educational way!" },
              {
                type: "image_url",
                image_url: { url: image }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Groq API Error:', error)
      throw new Error(error.error?.message || 'Failed to analyze image')
    }

    const data = await response.json()
    console.log('Groq API Response:', data)

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})