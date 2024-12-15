import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, age = 8 } = await req.json();
    console.log('Generating quiz for:', { topic, age });

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      throw new Error('API configuration error');
    }

    const prompt = `Create a fun, educational quiz about "${topic}" for a ${age}-year-old child.
    The quiz must have exactly 5 questions.
    Each question must have exactly 4 options.
    Format your response as a valid JSON array of questions.
    
    Each question object must have:
    - question (string): The actual question text
    - options (array): Exactly 4 answer options as strings
    - correctAnswer (number): Index (0-3) of the correct option
    
    Example format:
    [
      {
        "question": "What is the largest planet in our solar system?",
        "options": ["Mars", "Jupiter", "Saturn", "Earth"],
        "correctAnswer": 1
      }
    ]
    
    Make the questions fun, engaging, and age-appropriate.
    Include one silly or funny option in each question to make it entertaining.
    Keep the language simple and clear for children.`;

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
            content: 'You are an educational AI creating fun quizzes for children. Format all responses as valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error('Error from Groq API:', await response.text());
      throw new Error('Failed to generate quiz from API');
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    let quizContent;
    try {
      // Parse and validate the content
      const content = data.choices[0].message.content;
      console.log('Raw quiz content:', content);
      
      // Clean the content - remove code blocks and extra whitespace
      const cleanContent = content
        .replace(/```json\s*|\s*```/g, '')
        .trim();
      
      quizContent = JSON.parse(cleanContent);
      
      // Validate quiz structure
      if (!Array.isArray(quizContent)) {
        throw new Error('Quiz content must be an array');
      }

      if (quizContent.length !== 5) {
        throw new Error('Quiz must have exactly 5 questions');
      }

      // Validate each question
      quizContent = quizContent.map((q, index) => {
        if (!q.question || typeof q.question !== 'string') {
          throw new Error(`Invalid question text at index ${index}`);
        }
        
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }
        
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Invalid correctAnswer at index ${index}`);
        }

        return {
          question: q.question,
          options: q.options.map(String), // Ensure all options are strings
          correctAnswer: q.correctAnswer,
          topic
        };
      });
    } catch (error) {
      console.error('Error parsing quiz content:', error);
      throw new Error(`Invalid quiz format: ${error.message}`);
    }

    console.log('Processed quiz content:', quizContent);

    return new Response(
      JSON.stringify({
        questions: quizContent,
        success: true
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    console.error('Error generating quiz:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate quiz', 
        details: error.message,
        success: false
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