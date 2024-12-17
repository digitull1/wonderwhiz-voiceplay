import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

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

    // Generate exactly 5 blocks with specific types
    const blocks: Block[] = [];

    // First 3 blocks from API response
    if (data?.blocks && Array.isArray(data.blocks)) {
      blocks.push(...data.blocks.slice(0, 3));
    }
    
    // Add image block (4th block)
    blocks.push({
      title: `🎨 Create amazing art about ${topic}!`,
      description: "Let's make something creative",
      metadata: {
        topic,
        type: "image",
        prompt: `Create a fun, educational illustration about ${topic}`
      }
    });

    // Add quiz block (5th block)
    blocks.push({
      title: `🎯 Test your ${topic} knowledge!`,
      description: "Are you ready for a challenge?",
      metadata: {
        topic,
        type: "quiz",
        prompt: `Generate engaging quiz questions about ${topic}`
      }
    });

    // Ensure we always return exactly 5 blocks
    while (blocks.length < 5) {
      blocks.push(getFallbackBlock(topic, blocks.length));
    }

    console.log('Generated blocks:', blocks);
    return blocks.slice(0, 5); // Ensure we only return 5 blocks
  } catch (error) {
    console.error('Error generating related blocks:', error);
    return getFallbackBlocks(topic);
  }
};

const getFallbackBlock = (topic: string, index: number): Block => {
  const types = ["fact", "fact", "fact", "image", "quiz"];
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