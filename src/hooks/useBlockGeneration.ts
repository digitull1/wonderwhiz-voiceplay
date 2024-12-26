import { supabase } from "@/integrations/supabase/client";
import { Block, UserProfile } from "@/types/chat";

export const useBlockGeneration = (userProfile: UserProfile | null) => {
  const generateDynamicBlocks = async (
    response: string, 
    topic: string,
    previousContext: string = ""
  ): Promise<Block[]> => {
    console.log("Generating blocks for topic:", topic, "with context:", previousContext);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blocks', {
        body: {
          query: response,
          context: topic,
          previous_context: previousContext,
          age_group: userProfile ? `${userProfile.age}-${userProfile.age + 2}` : "8-12",
          name: userProfile?.name
        }
      });

      if (error) {
        console.error('Error generating blocks:', error);
        throw error;
      }

      console.log("Generated blocks data:", data);
      if (data?.choices?.[0]?.message?.content) {
        const parsedData = typeof data.choices[0].message.content === 'string' 
          ? JSON.parse(data.choices[0].message.content) 
          : data.choices[0].message.content;

        console.log("Generated blocks:", parsedData.blocks);
        
        const formattedBlocks = (parsedData.blocks || []).map((block: Block) => ({
          ...block,
          title: block.title?.substring(0, 75) || "",
          metadata: {
            ...block.metadata,
            topic: block.metadata?.topic || topic
          }
        }));

        return formattedBlocks;
      }
      return [];
    } catch (error) {
      console.error('Error generating blocks:', error);
      return [];
    }
  };

  return { generateDynamicBlocks };
};