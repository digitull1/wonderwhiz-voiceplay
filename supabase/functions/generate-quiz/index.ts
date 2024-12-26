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
    const { topic } = await req.json()
    console.log('Generating quiz for topic:', topic)

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{
          role: 'system',
          content: 'You are a helpful AI that generates educational quizzes for children.'
        }, {
          role: 'user',
          content: `Generate a quiz question about ${topic}. Return it in JSON format with the following structure:
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": number (0-3),
            "explanation": "string"
          }`
        }],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`)
    }

    const data = await response.json()
    const quizContent = JSON.parse(data.choices[0].message.content)
    
    console.log('Quiz generated successfully')

    return new Response(
      JSON.stringify({ questions: quizContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate quiz', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})