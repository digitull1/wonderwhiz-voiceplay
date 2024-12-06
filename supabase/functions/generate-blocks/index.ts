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

    const apiKey = Deno.env.get('GROQ_API_KEY') || Deno.env.get('Groq');
    if (!apiKey) {
      console.error('Neither GROQ_API_KEY nor Groq secret is set');
      throw new Error('Groq API key not configured');
    }

    const prompt = `
      Based on this chat message: "${query}" and the current topic "${context}",
      generate 3 engaging, educational blocks for a ${age_group} year old ${name ? `named ${name}` : 'child'}.
      Each block should:
      1. Start with a relevant emoji
      2. Have a clickbait-style "Did you know?" title that makes kids curious
      3. Include a one-sentence teaser that makes them want to learn more
      4. End with an exciting question that prompts them to click
      
      Format the response as a JSON object with this structure:
      {
        "blocks": [
          {
            "title": "🌟 Did you know [fascinating fact]?",
            "description": "One engaging teaser sentence + exciting question",
            "metadata": {
              "topic": "specific_subtopic"
            }
          }
        ]
      }

      Make each block title and description super engaging and fun!
      Think of them like trading cards that kids will want to collect.
      Keep the language simple and exciting for the target age group.
    `

    console.log("Sending request to Groq API with prompt:", prompt);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are WonderWhiz, an exciting AI tutor that makes learning feel like an adventure!
            Your responses should:
            1. Be concise and engaging
            2. Use simple language for kids
            3. Include relevant emojis (but not too many)
            4. Break up text into short paragraphs
            5. End with a natural question that makes them curious to learn more`
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

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API Error:", error);
      throw new Error(error.error?.message || "Failed to get response from Groq");
    }

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