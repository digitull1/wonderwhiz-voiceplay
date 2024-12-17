import { Block } from "@/types/block";
import { supabase } from "@/integrations/supabase/client";

const getFallbackBlock = (topic: string, index: number): Block => {
  const types: Array<'fact' | 'image' | 'quiz'> = ["fact", "fact", "fact", "image", "quiz"];
  const emojis = ["🌟", "💡", "🔍", "🎨", "🎯"];
  
  return {
    title: `${emojis[index]} Explore ${topic}!`,
    description: "Click to learn more",
    metadata: {
      topic,
      type: types[index],
      prompt: `Tell me about ${topic}`
    }
  };
};

const getFallbackBlocks = (topic: string): Block[] => {
  return Array.from({ length: 5 }, (_, i) => getFallbackBlock(topic, i));
};

export const generateRelatedBlocks = async (topic: string, age: number): Promise<Block[]> => {
  try {
    console.log('Generating blocks for:', { topic, age });
    
    const { data, error } = await supabase.functions.invoke('generate-blocks', {
      body: {
        query: topic,
        context: topic,
        age_group: `${age}-${age + 2}`
      }
    });

    if (error) {
      console.error('Error generating blocks:', error);
      throw error;
    }

    console.log('API response:', data);

    // Initialize blocks array with 5 slots
    const blocks: Block[] = [];

    // Add fact blocks from API response (up to 3)
    if (data?.blocks && Array.isArray(data.blocks)) {
      const factBlocks = data.blocks.slice(0, 3).map(block => ({
        ...block,
        metadata: {
          ...block.metadata,
          type: 'fact' as const
        }
      }));
      blocks.push(...factBlocks);
    }

    // Fill remaining fact blocks if needed
    while (blocks.length < 3) {
      blocks.push(getFallbackBlock(topic, blocks.length));
    }
    
    // Always add image block (4th block)
    blocks.push({
      title: `🎨 Create amazing art about ${topic}!`,
      description: "Let's make something creative",
      metadata: {
        topic,
        type: 'image' as const,
        prompt: `Create a fun, educational illustration about ${topic}`
      }
    });

    // Always add quiz block (5th block)
    blocks.push({
      title: `🎯 Test your ${topic} knowledge!`,
      description: "Are you ready for a challenge?",
      metadata: {
        topic,
        type: 'quiz' as const,
        prompt: `Generate engaging quiz questions about ${topic}`
      }
    });

    console.log('Generated blocks:', blocks);
    return blocks;
  } catch (error) {
    console.error('Error generating related blocks:', error);
    return getFallbackBlocks(topic);
  }
};