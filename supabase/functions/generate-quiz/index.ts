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
    
    VERY IMPORTANT RULES FOR THE RESPONSE FORMAT:
    1. Response must be a valid JSON object
    2. Each question MUST have these exact fields:
       - question (string)
       - options (array of exactly 4 strings)
       - correctAnswer (number 0-3 indicating the correct option's index)
       - topic (string matching the provided topic)
    3. Generate exactly 5 questions
    4. The correctAnswer must be a valid index (0-3) corresponding to the correct option
    5. No markdown formatting or extra text
    
    Example format:
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
            content: `You are a quiz generator for children aged ${age}. You MUST ONLY respond with properly formatted JSON containing quiz questions. Do not include any additional text or explanations.`
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
      // Clean up the response content
      const content = data.choices[0].message.content.trim();
      console.log("Content to parse:", content);
      
      if (!content.startsWith('{')) {
        throw new Error("Response does not start with valid JSON");
      }
      
      quizData = JSON.parse(content);
      console.log("Parsed quiz data:", quizData);

      // Validate quiz data structure
      if (!Array.isArray(quizData.questions)) {
        throw new Error("Quiz data must contain a questions array");
      }

      if (quizData.questions.length !== 5) {
        throw new Error(`Expected 5 questions, got ${quizData.questions.length}`);
      }

      // Validate each question
      quizData.questions.forEach((question: QuizQuestion, index: number) => {
        if (!question.question || typeof question.question !== 'string') {
          throw new Error(`Invalid question text at index ${index}`);
        }
        
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          throw new Error(`Invalid options array at index ${index}`);
        }
        
        if (question.options.some(opt => typeof opt !== 'string')) {
          throw new Error(`Invalid option type at index ${index}`);
        }
        
        if (typeof question.correctAnswer !== 'number' || 
            question.correctAnswer < 0 || 
            question.correctAnswer > 3) {
          throw new Error(`Invalid correctAnswer at index ${index}`);
        }
        
        if (!question.topic || typeof question.topic !== 'string') {
          throw new Error(`Invalid topic at index ${index}`);
        }

        // Ensure the topic matches
        question.topic = topic;
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