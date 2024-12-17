import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export const generateRelatedBlocks = async (topic: string, age: number): Promise<Block[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-blocks', {
      body: {
        query: topic,
        context: topic,
        age_group: `${age}-${age + 2}`
      }
    });

    if (error) throw error;

    // Generate exactly 5 blocks with specific types
    const blocks: Block[] = [];

    // First 3 blocks for content
    for (let i = 0; i < 3; i++) {
      blocks.push({
        title: `🌟 Discover amazing fact #${i + 1} about ${topic}!`,
        description: "Click to learn something fascinating!",
        metadata: {
          topic,
          type: "fact",
          prompt: `Tell me an interesting fact about ${topic}`
        }
      });
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

    return blocks;
  } catch (error) {
    console.error('Error generating related blocks:', error);
    return getFallbackBlocks(topic);
  }
};

const getFallbackBlocks = (topic: string): Block[] => {
  return [
    {
      title: `🌟 Discover amazing facts about ${topic}!`,
      description: "Click to learn more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `💡 Explore interesting ideas about ${topic}!`,
      description: "Click to discover more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `🔍 Investigate the secrets of ${topic}!`,
      description: "Click to uncover more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `🎨 Create amazing art about ${topic}!`,
      description: "Let's make something creative",
      metadata: {
        topic,
        type: "image"
      }
    },
    {
      title: `🎯 Test your ${topic} knowledge!`,
      description: "Ready for a challenge?",
      metadata: {
        topic,
        type: "quiz"
      }
    }
  ];
};