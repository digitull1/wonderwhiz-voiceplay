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
    
    The response should be in JSON format with the following structure:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number (0-3),
          "topic": "${topic}"
        }
      ]
    }
    
    IMPORTANT: Generate exactly 5 questions, each with unique content about ${topic}.`;

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
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    console.log("Quiz generation response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Failed to generate quiz questions");
    }

    const quizData = JSON.parse(data.choices[0].message.content);
    console.log("Parsed quiz data:", quizData);

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
        questions: [
          {
            question: "What makes learning fun?",
            options: [
              "Making new discoveries",
              "Solving puzzles",
              "Learning with friends",
              "All of the above"
            ],
            correctAnswer: 3,
            topic: "learning"
          },
          {
            question: "Why is curiosity important?",
            options: [
              "It helps us learn new things",
              "It makes us ask questions",
              "It leads to discoveries",
              "All of these reasons"
            ],
            correctAnswer: 3,
            topic: "learning"
          },
          {
            question: "What's the best way to remember something new?",
            options: [
              "Practice it regularly",
              "Teach it to someone else",
              "Write it down",
              "All of these methods"
            ],
            correctAnswer: 3,
            topic: "learning"
          },
          {
            question: "How can we learn from mistakes?",
            options: [
              "Try again with a new approach",
              "Ask for help when needed",
              "Think about what went wrong",
              "All of these ways"
            ],
            correctAnswer: 3,
            topic: "learning"
          },
          {
            question: "What makes a good learner?",
            options: [
              "Being patient and persistent",
              "Asking questions when confused",
              "Helping others learn too",
              "All of these qualities"
            ],
            correctAnswer: 3,
            topic: "learning"
          }
        ]
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
