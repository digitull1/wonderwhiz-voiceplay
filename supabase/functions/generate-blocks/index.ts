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
    const { query, context, age_group, name } = await req.json()
    console.log("Generating blocks for:", { query, context, age_group, name });

    const prompt = `
      Based on this chat message: "${query}" and the current topic "${context}",
      generate 3 engaging, educational blocks for a ${age_group} year old ${name ? `named ${name}` : 'child'}.
      Each block should have a fun emoji and a single-sentence description.
      Focus on making the content exciting and age-appropriate.
      
      Format the response as a JSON object with this structure:
      {
        "blocks": [
          {
            "title": "Fun, emoji-starting title",
            "description": "One engaging sentence.",
            "metadata": {
              "topic": "specific_subtopic"
            }
          }
        ]
      }

      Make sure each block title is super engaging and fun, using emojis and exciting language!
      Think of it like creating trading cards that kids will want to collect.
    `

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating engaging, educational content for children."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    console.log("Generated blocks:", data)

    return new Response(
      JSON.stringify(data),
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