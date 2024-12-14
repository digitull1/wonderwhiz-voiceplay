import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { GEMINI_PROMPTS, getSystemPrompt } from "../_shared/geminiPrompts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerationRequest {
  prompt: string;
  context: {
    age: number;
    interests: string[];
    name?: string;
    lastTopic?: string;
    promptType: keyof typeof GEMINI_PROMPTS;
    [key: string]: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { prompt, context }: GenerationRequest = await req.json();
    const { age, interests, promptType, ...otherContext } = context;

    // Get the system prompt with user context
    const systemPrompt = getSystemPrompt(age, interests);

    // Get the specific prompt based on the promptType
    let specificPrompt = "";
    if (typeof GEMINI_PROMPTS[promptType] === "function") {
      specificPrompt = GEMINI_PROMPTS[promptType](age, ...Object.values(otherContext));
    } else {
      specificPrompt = GEMINI_PROMPTS[promptType];
    }

    // Combine prompts
    const fullPrompt = `${systemPrompt}\n\n${specificPrompt}\n\n${prompt}`;

    console.log('Generating content with prompt:', fullPrompt);

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ 
        text,
        timestamp: new Date().toISOString(),
        context: context,
        metadata: {
          model: "gemini-pro",
          promptType,
          systemPrompt: true
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in generate-with-gemini:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        metadata: {
          type: error.name,
          status: error.status || 500,
          details: error.details || null
        }
      }),
      { 
        status: error.status || 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});