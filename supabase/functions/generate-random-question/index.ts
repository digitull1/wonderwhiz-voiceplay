import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { age } = await req.json()

    const topics = [
      "space and planets",
      "dinosaurs",
      "animals",
      "science experiments",
      "nature",
      "technology",
      "history",
      "art and creativity",
      "music",
      "sports",
      "food and cooking",
      "geography",
      "ocean life",
      "weather",
      "inventions"
    ]

    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are WonderWhiz, an AI tutor for children aged ${age}. Generate an engaging, age-appropriate question about ${randomTopic}. The question should:
            1. Be simple and clear for ${age}-year-olds
            2. Encourage curiosity and learning
            3. Be fun and exciting
            4. Not be too complex or use difficult words
            5. Start with words like "Can you tell me", "What's your favorite", "Did you know", or "I wonder"`
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      })
    })

    const data = await response.json()
    const question = data.choices[0].message.content.trim()

    return new Response(
      JSON.stringify({ question }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-random-question function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})