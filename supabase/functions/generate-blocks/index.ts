import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

console.log('Loading generate-blocks function...');

const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${maxRetries}`);
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const generateWithGemini = async (prompt: string, age_group: string) => {
  console.log('Generating content with Gemini...', { prompt, age_group });
  
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const structuredPrompt = `
    You are WonderWhiz, an AI assistant for children aged ${age_group}.
    Based on the topic "${prompt}", generate 3 engaging, educational blocks.
    Each block must be:
    1. Directly related to the topic "${prompt}"
    2. Age-appropriate for ${age_group}
    3. Educational and factual
    4. Fun and engaging
    5. Safe and child-friendly

    Format your response as a JSON object with this exact structure:
    {
      "blocks": [
        {
          "title": "🌟 [Your title here]",
          "metadata": {
            "topic": "[specific subtopic]",
            "type": "fact"
          }
        }
      ]
    }

    Each title must:
    - Start with an emoji
    - Be under 70 characters
    - Be directly related to ${prompt}
    - Be educational and engaging
    - Be appropriate for children aged ${age_group}
    
    Only return the JSON object, no other text.
  `;

  try {
    const result = await model.generateContent(structuredPrompt);
    console.log('Raw Gemini response:', result);

    if (!result?.response?.text()) {
      throw new Error('Empty response from Gemini API');
    }

    return result.response.text();
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    throw error;
  }
};

serve(async (req) => {
  const headers = {
    ...corsHeaders,
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers });
  }

  try {
    console.log('Processing request...');
    
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { query, context, age_group = "8-11" } = await req.json();
    console.log('Request parameters:', { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    let content;
    try {
      content = await retryWithBackoff(() => generateWithGemini(query, age_group));
      console.log('Generated content:', content);
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      
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

      console.log('Final blocks structure:', parsedContent);

      return new Response(
        JSON.stringify(parsedContent),
        { headers }
      );

    } catch (error) {
      console.error('Error parsing or processing content:', error);
      throw new Error(`Failed to process response: ${error.message}`);
    }

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
    const topic = context || "this topic";
    const fallbackResponse = {
      blocks: [
        {
          title: `🌟 Discover amazing facts about ${topic}!`,
          metadata: {
            topic: topic,
            type: "fact"
          }
        },
        {
          title: `🎨 Create ${topic} artwork!`,
          metadata: {
            topic: topic,
            type: "image"
          }
        },
        {
          title: `🎯 Test your ${topic} knowledge!`,
          metadata: {
            topic: topic,
            type: "quiz"
          }
        }
      ]
    };
    
    return new Response(
      JSON.stringify(fallbackResponse),
      { 
        headers,
        status: 200
      }
    );
  }
});