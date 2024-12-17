import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from './corsUtils.ts';
import { getFallbackBlocks } from './fallbackContent.ts';
import { initializeGemini, generateContent } from './geminiUtils.ts';
import { BlockGenerationRequest } from './types.ts';

const validateRequest = async (req: Request) => {
  if (req.method !== 'POST') {
    throw new Error(`Method ${req.method} not allowed`);
  }

  try {
    const body = await req.json();
    if (!body) {
      throw new Error('Invalid request body');
    }
    return body as BlockGenerationRequest;
  } catch (error) {
    console.error('Error parsing request:', error);
    throw new Error('Invalid request format');
  }
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Validate request
    const { query = "", context = "general" } = await validateRequest(req);
    console.log('Processing request:', { query, context });

    // Check API key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify(getFallbackBlocks(context)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Gemini
    const genAI = initializeGemini(GEMINI_API_KEY);
    if (!genAI) {
      return new Response(
        JSON.stringify(getFallbackBlocks(context)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are WonderWhiz, a fun and curious AI tutor for kids.
    Generate engaging content about "${query}" in the context of "${context}".
    Make it educational, fun, and suitable for children.
    Include emojis and keep the language simple and clear.
    
    Format your response as a JSON object with this structure:
    {
      "text": "main response text with emojis",
      "blocks": [
        {
          "title": "engaging title with emoji",
          "metadata": {
            "topic": "specific topic",
            "type": "fact/image/quiz",
            "prompt": "detailed prompt for content generation"
          }
        }
      ]
    }`;

    const response = await generateContent(model, prompt, context);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blocks:', error);
    const statusCode = error.message === 'RATE_LIMIT' ? 429 : 500;
    
    return new Response(
      JSON.stringify({
        error: 'Failed to generate blocks',
        details: error.message,
        fallback: getFallbackBlocks("general")
      }),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});