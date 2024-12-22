import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getFallbackBlocks = (topic: string = "general") => ({
  blocks: [
    {
      title: "🌟 Discover Amazing Facts About Our World!",
      description: "Click to learn fascinating facts that will blow your mind!",
      metadata: { type: 'fact', topic }
    },
    {
      title: "🔍 Explore the Mysteries of Science",
      description: "Dive deeper into exciting scientific discoveries!",
      metadata: { type: 'exploration', topic: 'science' }
    },
    {
      title: "💭 Test Your Knowledge with Fun Questions",
      description: "Think you know everything? Let's find out!",
      metadata: { type: 'quiz-teaser', topic }
    },
    {
      title: "🎨 Create Amazing Pictures",
      description: "Let's make something beautiful together!",
      metadata: { type: 'image', topic: 'art' }
    },
    {
      title: "🎯 Challenge Yourself with a Quiz",
      description: "Ready to become a quiz champion?",
      metadata: { type: 'quiz', topic }
    }
  ]
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context = "general", age_group = "8-12" } = await req.json();
    console.log('Generating content for:', { query, context, age_group });

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent([{
        text: `Generate 5 engaging, educational blocks about "${query}" for children aged ${age_group}.
               Format as JSON with title (max 72 chars), description (2 sentences), and metadata (type and topic).
               Types should be: fact, exploration, quiz-teaser, image, or quiz.
               Make it fun and child-friendly!`
      }]);

      const response = result.response;
      const text = response.text();
      console.log('Generated content:', text);

      let blocks;
      try {
        blocks = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        return new Response(
          JSON.stringify(getFallbackBlocks(context)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(blocks),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Check if it's a rate limit error
      if (geminiError.message?.includes('429') || geminiError.message?.includes('quota')) {
        console.log('Rate limit hit, using fallback content');
        return new Response(
          JSON.stringify(getFallbackBlocks(context)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw geminiError;
    }
  } catch (error) {
    console.error('Error generating blocks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate blocks',
        details: error.message,
        fallback: getFallbackBlocks(context).blocks
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});