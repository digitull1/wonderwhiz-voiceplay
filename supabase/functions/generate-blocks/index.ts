import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, age_group = "8-12" } = await req.json();
    console.log('Generating content for:', { query, context, age_group });

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content based on block type
    const blockTypes = ['fact', 'exploration', 'quiz-teaser', 'image', 'quiz'];
    const blocks = await Promise.all(blockTypes.map(async (type) => {
      const prompt = getPromptForBlockType(type, query, age_group);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      return {
        title: `${getEmojiForType(type)} ${text.split('\n')[0].substring(0, 72)}`,
        description: text.split('\n')[1] || "Click to explore more!",
        metadata: {
          type,
          topic: context,
          prompt: text
        }
      };
    }));

    return new Response(
      JSON.stringify({ blocks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating blocks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate blocks',
        details: error.message,
        fallback: getFallbackBlocks()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function getPromptForBlockType(type: string, query: string, age_group: string): string {
  const basePrompt = `As WonderWhiz, create engaging, educational content for children aged ${age_group} about ${query}.`;
  
  switch (type) {
    case 'fact':
      return `${basePrompt}\nGenerate a fascinating fact with a hook question. Make it fun and simple to understand.`;
    case 'exploration':
      return `${basePrompt}\nCreate a deeper explanation with an interesting analogy that children can relate to.`;
    case 'quiz-teaser':
      return `${basePrompt}\nWrite an intriguing fact that leads to a quiz question.`;
    case 'image':
      return `${basePrompt}\nDescribe a whimsical, child-friendly image that would illustrate this topic.`;
    case 'quiz':
      return `${basePrompt}\nGenerate 5 multiple-choice questions with one correct answer and three options (make one silly).`;
    default:
      return basePrompt;
  }
}

function getEmojiForType(type: string): string {
  switch (type) {
    case 'fact': return '🌟';
    case 'exploration': return '🔍';
    case 'quiz-teaser': return '💭';
    case 'image': return '🎨';
    case 'quiz': return '🎯';
    default: return '✨';
  }
}

function getFallbackBlocks() {
  return [
    {
      title: "🌟 Discover Amazing Facts About Our World!",
      description: "Click to learn fascinating facts that will blow your mind!",
      metadata: { type: 'fact', topic: 'general' }
    },
    {
      title: "🔍 Explore the Mysteries of Science",
      description: "Dive deeper into exciting scientific discoveries!",
      metadata: { type: 'exploration', topic: 'science' }
    },
    {
      title: "💭 Test Your Knowledge with Fun Questions",
      description: "Think you know everything? Let's find out!",
      metadata: { type: 'quiz-teaser', topic: 'general' }
    },
    {
      title: "🎨 Create Amazing Pictures",
      description: "Let's make something beautiful together!",
      metadata: { type: 'image', topic: 'art' }
    },
    {
      title: "🎯 Challenge Yourself with a Quiz",
      description: "Ready to become a quiz champion?",
      metadata: { type: 'quiz', topic: 'general' }
    }
  ];
}