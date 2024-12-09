import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, age = 8 } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log(`Generating quiz for topic: ${topic}, age: ${age}`);

    const prompt = `Generate a fun and educational quiz about ${topic} for children aged ${age}.

    Guidelines:
    - Keep questions simple and clear
    - Use age-appropriate language
    - Make it fun and engaging
    - Use encouraging, positive language
    - Avoid complex terminology
    
    Format the response EXACTLY like this example, with NO additional text or characters:
    {
      "questions": [
        {
          "question": "What causes rain?",
          "options": ["Water vapor cooling", "Magic spells", "Dancing clouds", "Hot sunshine"],
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
        "Content-Type": "application/json"
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
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      throw new Error(`Failed to generate quiz: ${error}`);
    }

    const data = await response.json();
    console.log('Received response from Groq API');

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
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz data format: missing or invalid questions array");
      }

      // Validate each question
      quizData.questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
            typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

    } catch (error) {
      console.error('Error parsing quiz data:', error);
      throw new Error(`Invalid quiz data format: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: quizData 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: "Failed to generate quiz. Please try again."
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});