import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestData;
    try {
      requestData = await req.json();
      console.log('Request data received:', requestData);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { topic, age = 8 } = requestData;

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
    
    Format the response EXACTLY like this example, with NO additional text or characters:
    {
      "questions": [
        {
          "question": "What color is the sky on a clear day?",
          "options": ["Blue", "Green", "Red", "Yellow"],
          "correctAnswer": 0,
          "topic": "Weather"
        }
      ]
    }`;

    console.log('Sending prompt to Groq API');
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
            content: "You are a quiz generator for children. You MUST ONLY respond with properly formatted JSON containing quiz questions. Do not include any additional text, whitespace, or explanations."
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

    let quizData: QuizData;
    try {
      // Clean up the response content by removing any whitespace before and after the JSON
      const content = data.choices[0].message.content.trim();
      console.log("Raw content before parsing:", content);
      
      // Ensure the content starts with { and ends with }
      if (!content.startsWith('{') || !content.endsWith('}')) {
        throw new Error("Response is not a valid JSON object");
      }
      
      quizData = JSON.parse(content);
      console.log("Successfully parsed quiz data:", quizData);

      // Validate quiz data structure
      if (!Array.isArray(quizData.questions)) {
        throw new Error("Quiz data must contain a questions array");
      }

      if (quizData.questions.length !== 5) {
        throw new Error(`Expected 5 questions, got ${quizData.questions.length}`);
      }

      // Validate each question
      quizData.questions.forEach((question: QuizQuestion, index: number) => {
        if (!question.question || 
            !Array.isArray(question.options) || 
            question.options.length !== 4 || 
            typeof question.correctAnswer !== 'number' ||
            question.correctAnswer < 0 || 
            question.correctAnswer > 3 ||
            !question.topic) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

    } catch (error) {
      console.error("Error parsing or validating quiz data:", error);
      throw new Error(`Invalid quiz data format: ${error.message}`);
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