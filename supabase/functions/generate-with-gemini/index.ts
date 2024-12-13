import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerationRequest {
  prompt: string;
  context?: Record<string, unknown>;
  options?: {
    temperature?: number;
    maxTokens?: number;
    safetySettings?: Array<{
      category: string;
      threshold: string;
    }>;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const requestData: GenerationRequest = await req.json();
    const { prompt, context, options = {} } = requestData;
    
    console.log('Processing request:', { 
      prompt, 
      context,
      options: {
        ...options,
        apiKey: apiKey ? '[REDACTED]' : undefined
      }
    });

    // Add retry logic for rate limits
    let attempts = 0;
    const maxAttempts = 3;
    let result;
    let error;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);
        result = await model.generateContent(prompt);
        
        if (!result?.response) {
          throw new Error('Empty response from Gemini API');
        }
        
        break;
      } catch (e) {
        error = e;
        attempts++;
        
        console.error(`Error on attempt ${attempts}:`, e);
        
        if (e.message?.includes('rate') && attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000;
          console.log(`Rate limit hit, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (attempts === maxAttempts) {
          throw e;
        }
      }
    }

    if (!result) {
      throw error || new Error('Failed to generate content after retries');
    }

    const response = await result.response;
    const text = response.text();

    console.log('Generated response:', text);

    return new Response(
      JSON.stringify({ 
        text,
        timestamp: new Date().toISOString(),
        context: context || {},
        metadata: {
          attempts,
          model: "gemini-pro",
          promptTokens: text.length, // Approximate token count
          totalAttempts: attempts,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 2048
          }
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
    
    const errorResponse = {
      error: error.message,
      timestamp: new Date().toISOString(),
      metadata: {
        type: error.name,
        status: error.status || 500,
        details: error.details || null,
        retryable: error.message?.includes('rate') || false
      }
    };

    console.error('Error response:', errorResponse);

    return new Response(
      JSON.stringify(errorResponse),
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