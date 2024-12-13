import { supabase } from "@/integrations/supabase/client";
import { Block } from "@/types/chat";

const getFallbackBlocks = (topic: string = "general"): Block[] => {
  return [
    {
      title: "🌟 Discover fascinating secrets about how animals communicate in the wild!",
      description: "Learn amazing facts about animal communication",
      metadata: {
        topic: topic,
        type: "fact",
        prompt: "Tell me fascinating facts about how different animals communicate in nature"
      }
    },
    {
      title: "🎨 Create a magical underwater world full of colorful sea creatures!",
      description: "Let's make something creative and colorful",
      metadata: {
        topic: topic,
        type: "image",
        prompt: "Create a vibrant, educational illustration of an underwater ecosystem with diverse marine life"
      }
    },
    {
      title: "🎯 Challenge yourself with fun questions about Earth's amazing creatures!",
      description: "Test your knowledge",
      metadata: {
        topic: topic,
        type: "quiz",
        prompt: "Generate engaging quiz questions about different animals and their unique abilities"
      }
    }
  ];
};

export const generateInitialBlocks = async (age: number): Promise<Block[]> => {
  try {
    console.log('Generating initial blocks for age:', age);
    
    const { data, error } = await supabase.functions.invoke('generate-blocks', {
      body: {
        query: `Generate engaging educational topics for a ${age} year old`,
        context: "general education",
        age_group: `${age}-${age + 2}`
      }
    });

    if (error) {
      console.error('Error from generate-blocks:', error);
      return getFallbackBlocks();
    }

    let parsedContent;
    try {
      parsedContent = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (!parsedContent?.blocks || !Array.isArray(parsedContent.blocks)) {
        throw new Error('Invalid blocks format in response');
      }

      const validatedBlocks = parsedContent.blocks
        .filter(block => block?.title && block?.metadata?.topic)
        .map(block => ({
          title: block.title.substring(0, 70), // Ensure title is not too long
          description: block.description || "Click to explore more!",
          metadata: {
            topic: block.metadata.topic,
            type: block.metadata.type || "fact",
            prompt: block.metadata.prompt || `Tell me about ${block.title}`
          }
        }));

      // Add image and quiz blocks with engaging prompts
      validatedBlocks.push({
        title: `🎨 Create an amazing illustration about ${parsedContent.blocks[0]?.metadata?.topic || 'nature'}!`,
        description: "Let's make something creative",
        metadata: {
          topic: parsedContent.blocks[0]?.metadata?.topic || 'nature',
          type: "image",
          prompt: `Create a detailed, educational illustration about ${parsedContent.blocks[0]?.metadata?.topic || 'nature'} that's engaging for children`
        }
      });

      validatedBlocks.push({
        title: `🎯 Test your knowledge about ${parsedContent.blocks[0]?.metadata?.topic || 'science'}!`,
        description: "Challenge yourself",
        metadata: {
          topic: parsedContent.blocks[0]?.metadata?.topic || 'science',
          type: "quiz",
          prompt: `Create an engaging quiz about ${parsedContent.blocks[0]?.metadata?.topic || 'science'} for children`
        }
      });

      return validatedBlocks;
    } catch (parseError) {
      console.error('Error parsing blocks:', parseError);
      return getFallbackBlocks();
    }
  } catch (error) {
    console.error('Error generating blocks:', error);
    return getFallbackBlocks();
  }
};