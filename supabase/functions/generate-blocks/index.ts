import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  validateRequest, 
  createFallbackBlocks,
  BlockGenerationRequest 
} from "../_shared/blockUtils.ts";
import { generateWithGemini } from "../_shared/geminiUtils.ts";

const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${maxRetries}`);
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

serve(async (req) => {
  try {
    const requestData = await validateRequest(req);
    console.log('Processing request with data:', requestData);

    const { query, context, age_group = "8-11" } = requestData;
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    const content = await retryWithBackoff(() => 
      generateWithGemini(query, age_group, apiKey!)
    );

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      console.log('Generated content:', parsedContent);

      if (!parsedContent?.blocks || !Array.isArray(parsedContent.blocks)) {
        throw new Error('Invalid blocks structure in response');
      }

      // Process and format blocks
      parsedContent.blocks = parsedContent.blocks.slice(0, 3).map(block => ({
        title: block.title?.substring(0, 75) || "Interesting fact!",
        metadata: {
          topic: block.metadata?.topic || context || query,
          type: block.metadata?.type || "fact"
        }
      }));

      // Add contextual image and quiz blocks
      parsedContent.blocks.push(
        {
          title: `🎨 Create ${context || query} artwork!`,
          metadata: {
            topic: context || query,
            type: "image"
          }
        },
        {
          title: `🎯 Test your ${context || query} knowledge!`,
          metadata: {
            topic: context || query,
            type: "quiz"
          }
        }
      );

    } catch (error) {
      console.error('Error parsing or processing content:', error);
      parsedContent = createFallbackBlocks(context || query);
    }

    return new Response(
      JSON.stringify(parsedContent),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
    return new Response(
      JSON.stringify(createFallbackBlocks(error.message)),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 // Return 200 even for errors to handle them gracefully
      }
    );
  }
});