import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Received request to analyze-image function');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, prompt } = await req.json()
    console.log('Processing image analysis with prompt:', prompt);

    if (!image) {
      console.error('No image data provided');
      throw new Error('No image data provided');
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not configured');
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Making request to Groq API for image analysis');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are WonderWhiz, an enthusiastic and friendly AI assistant for kids. Your responses should be engaging, educational, and include emojis. Keep explanations simple and fun. Always end with a question to spark curiosity.\n\n" + 
                      (prompt || "What's in this image? Explain it in a fun, educational way that's perfect for kids! Add some emojis to make it engaging!")
              },
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
    console.log('Successfully received response from Groq API');

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze image', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})