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

      IMPORTANT FORMATTING RULES:
      1. Each block must be EXACTLY ONE LINE of clickbait-style content
      2. Each line MUST be EXACTLY 75 CHARACTERS or LESS (including spaces and emoji)
      3. Each line MUST:
         - Start with "Did you know" or an exciting question
         - Include ONE fascinating fact
         - End with ONE relevant emoji
         - Be engaging and fun for kids
         - Make them want to click to learn more

      Example perfect blocks:
      - "Did you know the blue whale's heart is as big as a car? Let's explore this giant! 🐋"
      - "Want to discover why octopuses have three hearts? Click to find out! 🐙"
      - "Can you believe there's a planet where it rains diamonds? Let's visit Neptune! ✨"

      Format the response as a JSON object with this structure:
      {
        "blocks": [
          {
            "title": "Single line of exactly 75 chars or less with emoji",
            "metadata": {
              "topic": "specific_subtopic"
            }
          }
        ]
      }

      CRITICAL: Double-check that each title is 75 characters or less INCLUDING the emoji!
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
            Your task is to generate EXACTLY 3 blocks of content that:
            1. Are EXACTLY 75 characters or less (including spaces and emoji)
            2. Use simple language for kids
            3. Include ONE relevant emoji at the end
            4. Make kids curious to learn more
            5. Follow the clickbait-style format perfectly`
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