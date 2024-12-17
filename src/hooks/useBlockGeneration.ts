import { supabase } from "@/integrations/supabase/client";
import { Block, UserProfile } from "@/types/chat";
import { useToast } from "./use-toast";

export const useBlockGeneration = (userProfile: UserProfile | null) => {
  const { toast } = useToast();

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

  const generateDynamicBlocks = async (
    response: string, 
    topic: string,
    previousContext: string = ""
  ): Promise<Block[]> => {
    console.log("Generating blocks for:", {
      topic,
      responseLength: response?.length,
      previousContextLength: previousContext?.length,
      userProfile: userProfile ? {
        age: userProfile.age,
        language: userProfile.language
      } : 'none'
    });
    
    try {
      const makeRequest = async () => {
        console.log("Making request to generate-blocks function");
        
        const requestBody = {
          query: response,
          context: topic,
          previous_context: previousContext,
          age_group: userProfile ? `${userProfile.age}-${userProfile.age + 2}` : "8-12",
          name: userProfile?.name,
          language: userProfile?.language || 'en'
        };
        
        console.log("Request body:", JSON.stringify(requestBody, null, 2));

        const { data, error } = await supabase.functions.invoke('generate-blocks', {
          body: requestBody
        });

        if (error) {
          console.error('Error from generate-blocks:', error);
          // Parse the error response body if it exists
          let errorBody;
          try {
            errorBody = typeof error.message === 'string' && error.message.includes('{') 
              ? JSON.parse(error.message)
              : null;
          } catch (e) {
            console.error('Error parsing error body:', e);
          }

          // If we have fallback content in the error response, use it
          if (errorBody?.body) {
            try {
              const parsedBody = JSON.parse(errorBody.body);
              if (parsedBody.fallback) {
                console.log('Using fallback content from error response');
                return parsedBody.fallback;
              }
            } catch (e) {
              console.error('Error parsing fallback content:', e);
            }
          }
          
          throw error;
        }

        console.log("Response from generate-blocks:", data);
        return data;
      };

      const data = await retryWithBackoff(makeRequest);

      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!parsedData?.blocks || !Array.isArray(parsedData.blocks)) {
        throw new Error('Invalid blocks format in response');
      }

      const formattedBlocks = parsedData.blocks.map((block: Block) => ({
        ...block,
        title: block.title?.substring(0, 75) || "",
        metadata: {
          ...block.metadata,
          topic: block.metadata?.topic || topic
        }
      }));

      console.log("Formatted blocks:", formattedBlocks);
      return formattedBlocks;

    } catch (error) {
      console.error('Error generating blocks:', error);
      
      // Show a user-friendly toast message
      toast({
        title: "Taking a quick break! 🌟",
        description: "We're generating lots of fun content! Here are some cool topics to explore in the meantime.",
        variant: "default"
      });
      
      // Return contextual fallback blocks
      return [
        {
          title: `🌟 Learn more about ${topic}!`,
          description: "Discover fascinating facts",
          metadata: {
            topic: topic,
            type: "fact"
          }
        },
        {
          title: `🎨 Create ${topic} artwork!`,
          description: "Let's make something creative",
          metadata: {
            topic: topic,
            type: "image"
          }
        },
        {
          title: `🎯 Test your ${topic} knowledge!`,
          description: "Challenge yourself",
          metadata: {
            topic: topic,
            type: "quiz"
          }
        }
      ];
    }
  };

  return { generateDynamicBlocks };
};