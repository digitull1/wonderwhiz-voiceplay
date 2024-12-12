import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders, handleCors } from "../_shared/cors.ts"
import { callGroq } from "../_shared/groq.ts"
import { parseGroqResponse, validateBlocksStructure } from "../_shared/jsonParser.ts"
import { generateAgeSpecificInstructions, buildPrompt } from "./prompts.ts"

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { query, context, age_group = "8-11" } = await req.json();
    console.log('Processing request with params:', { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = generateAgeSpecificInstructions(age_group);
    const prompt = buildPrompt(query, context, ageSpecificInstructions);
    
    console.log('Making request to Groq API with prompt:', prompt);
    
    const data = await callGroq([
      {
        role: "system",
        content: `You are WonderWhiz, generating exciting educational content for kids aged ${age_group}. Always respond with valid JSON only.`
      },
      { role: "user", content: prompt }
    ]);

    if (!data?.choices?.[0]?.message?.content) {
      console.error('Invalid response format from Groq API');
      throw new Error('Invalid response format from Groq API');
    }

    let parsedContent;
    try {
      parsedContent = parseGroqResponse(data.choices[0].message.content);
      parsedContent = validateBlocksStructure(parsedContent);
      console.log('Successfully parsed content:', parsedContent);
    } catch (error) {
      console.error('Error parsing Groq response:', error);
      throw new Error(`Failed to parse Groq response: ${error.message}`);
    }

    // Ensure we only have 3 content blocks
    parsedContent.blocks = parsedContent.blocks.slice(0, 3);

    // Add image and quiz blocks with the specific topic
    const imageBlock = {
      title: `🎨 Create amazing ${context} artwork!`,
      metadata: {
        topic: context,
        type: "image"
      }
    };

    const quizBlock = {
      title: `🎯 Test your ${context} knowledge!`,
      metadata: {
        topic: context,
        type: "quiz"
      }
    };

    // Add the image and quiz blocks
    parsedContent.blocks.push(imageBlock, quizBlock);

    console.log('Final blocks structure:', parsedContent);

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate blocks',
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});