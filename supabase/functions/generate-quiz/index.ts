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
    const { topic, age = 8 } = await req.json()
    console.log('Generating quiz for topic:', topic, 'age:', age)

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
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI that generates educational quizzes for children aged ${age}. 
                     Make questions fun, engaging, and age-appropriate.`
          },
          {
            role: 'user',
            content: `Generate an educational quiz question about ${topic}. The question should be:
                     1. Age-appropriate for ${age} year olds
                     2. Fun and engaging
                     3. Educational and factual
                     4. Have clear, unambiguous answers
                     
                     Return it in this exact JSON format:
                     {
                       "question": "Your question here?",
                       "options": ["Option A", "Option B", "Option C", "Option D"],
                       "correctAnswer": 0,
                       "explanation": "Brief, kid-friendly explanation",
                       "topic": "${topic}"
                     }`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Raw quiz response:', data)

    let quizContent
    try {
      quizContent = JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error('Error parsing quiz content:', error)
      throw new Error('Invalid quiz format received')
    }
    
    console.log('Parsed quiz content:', quizContent)

    return new Response(
      JSON.stringify({ questions: quizContent }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate quiz', 
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