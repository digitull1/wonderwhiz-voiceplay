import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GEMINI_PROMPTS } from "../_shared/prompts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, age = 8 } = await req.json();
    console.log('Generating quiz for:', { topic, age });

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

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
            content: GEMINI_PROMPTS.SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: GEMINI_PROMPTS.QUIZ_QUESTIONS(age, topic, 5)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw quiz response:', data);

    let quizContent;
    try {
      quizContent = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing quiz content:', error);
      throw new Error('Invalid quiz format received');
    }
    
    console.log('Parsed quiz content:', quizContent);

    return new Response(
      JSON.stringify(quizContent),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
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
    );
  }
});