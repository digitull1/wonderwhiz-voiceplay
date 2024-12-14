import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
            content: `You are a helpful AI that generates educational quizzes for children aged ${age}. 
                     Create 5 fun, engaging, and age-appropriate questions about ${topic}.
                     Each question should have 4 options with only one correct answer.
                     Make the questions progressively more challenging but keep them fun and interesting.`
          },
          {
            role: 'user',
            content: `Generate 5 quiz questions about ${topic} suitable for ${age} year olds.
                     Return them in this exact JSON format:
                     {
                       "questions": [
                         {
                           "question": "Your question here?",
                           "options": ["Option A", "Option B", "Option C", "Option D"],
                           "correctAnswer": 0,
                           "topic": "${topic}"
                         }
                       ]
                     }`
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