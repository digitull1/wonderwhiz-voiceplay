import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Request data received:', requestData);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { topic, age = 8, contextualPrompt } = requestData;

    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log('Generating quiz for topic:', topic, 'age:', age);

    const prompt = `Generate 5 engaging and educational quiz questions about ${topic}. 
    The questions should:
    - Be specifically about ${topic}
    - Be appropriate for a ${age}-year-old child
    - Start with easier questions and progressively get more challenging
    - Use simple, clear language that a ${age}-year-old can understand
    - Include fun facts that children find interesting
    - Have clear, unambiguous correct answers
    - Use encouraging, positive language
    - Avoid complex terminology
    
    Format the response EXACTLY like this example:
    {
      "questions": [
        {
          "question": "What color is the sky on a clear day?",
          "options": ["Blue", "Green", "Red", "Yellow"],
          "correctAnswer": 0,
          "topic": "Weather"
        }
      ]
    }
    
    IMPORTANT: Generate exactly 5 questions, each with unique content about ${topic}.
    Each question MUST have exactly 4 options.
    The correctAnswer MUST be a number between 0 and 3.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are an educational quiz generator for children aged ${age}. Create fun, engaging, and age-appropriate questions!`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('Error from Groq API:', await response.text());
      throw new Error('Failed to generate quiz from Groq API');
    }

    const data = await response.json();
    console.log("Raw Groq API response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("No content in Groq API response");
    }

    let quizData;
    try {
      quizData = JSON.parse(data.choices[0].message.content);
      console.log("Parsed quiz data:", quizData);

      // Validate quiz data structure
      if (!Array.isArray(quizData.questions)) {
        throw new Error("Quiz data must contain a questions array");
      }

      // Validate each question
      quizData.questions.forEach((question: any, index: number) => {
        if (!question.question || !Array.isArray(question.options) || 
            question.options.length !== 4 || 
            typeof question.correctAnswer !== 'number' ||
            question.correctAnswer < 0 || 
            question.correctAnswer > 3) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

    } catch (error) {
      console.error("Error parsing or validating quiz data:", error);
      throw new Error("Invalid quiz data format received from API");
    }

    return new Response(
      JSON.stringify(quizData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to generate quiz. Please try again."
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