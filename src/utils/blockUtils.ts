import { supabase } from "@/integrations/supabase/client";
import { Block } from "@/types/chat";

const getFallbackBlocks = (topic: string = "general"): Block[] => {
  return [
    {
      title: "🌟 Let's explore something amazing!",
      metadata: {
        topic: topic,
        type: "fact"
      }
    },
    {
      title: "🎨 Create some fun artwork!",
      metadata: {
        topic: topic,
        type: "image"
      }
    },
    {
      title: "🎯 Test your knowledge!",
      metadata: {
        topic: topic,
        type: "quiz"
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

    if (!data) {
      console.error('No data received from generate-blocks');
      return getFallbackBlocks();
    }

    console.log('Raw response from generate-blocks:', data);

    let parsedContent;
    try {
      if (typeof data.choices?.[0]?.message?.content === 'string') {
        parsedContent = JSON.parse(data.choices[0].message.content);
      } else {
        parsedContent = data.choices?.[0]?.message?.content;
      }
    } catch (parseError) {
      console.error('Error parsing blocks response:', parseError);
      return getFallbackBlocks();
    }

    if (!parsedContent?.blocks || !Array.isArray(parsedContent.blocks)) {
      console.error('Invalid blocks format received:', parsedContent);
      return getFallbackBlocks();
    }

    const validatedBlocks = parsedContent.blocks
      .filter(block => block?.title && block?.metadata?.topic)
      .map(block => ({
        title: block.title.substring(0, 75),
        metadata: {
          topic: block.metadata.topic,
          type: block.metadata.type || "fact"
        }
      }));

    console.log('Validated blocks:', validatedBlocks);
    
    return validatedBlocks.length > 0 ? validatedBlocks : getFallbackBlocks();
  } catch (error) {
    console.error('Error generating blocks:', error);
    return getFallbackBlocks();
  }
};