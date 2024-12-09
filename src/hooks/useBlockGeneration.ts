import { supabase } from "@/integrations/supabase/client";
import { Block, UserProfile } from "@/types/chat";
import { useToast } from "./use-toast";

export const useBlockGeneration = (userProfile: UserProfile | null) => {
  const { toast } = useToast();

  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const generateDynamicBlocks = async (
    response: string, 
    topic: string,
    previousContext: string = ""
  ): Promise<Block[]> => {
    console.log("Generating blocks for topic:", topic, "with context:", previousContext);
    
    try {
      const makeRequest = async () => {
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
          console.error('Error from generate-blocks:', error);
          throw error;
        }

        return data;
      };

      const data = await retryWithBackoff(makeRequest);
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

      // If we reach here, something went wrong with the data format
      console.error('Invalid data format received:', data);
      toast({
        title: "Oops!",
        description: "Had trouble generating content. Please try again!",
        variant: "destructive"
      });
      
      return [];
    } catch (error) {
      console.error('Error generating blocks:', error);
      
      // Show user-friendly error message
      toast({
        title: "Connection Error",
        description: "Having trouble connecting. Please check your internet and try again.",
        variant: "destructive"
      });
      
      return [];
    }
  };

  return { generateDynamicBlocks };
};