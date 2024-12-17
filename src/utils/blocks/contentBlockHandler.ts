import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateRelatedBlocks } from "./relatedBlocksGenerator";
import { handleError } from "./errorHandler";

export const handleContentBlock = async (block: Block, age: number) => {
  console.log('Handling content block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
      body: { 
        prompt: `Generate a fun, engaging fact for kids aged ${age} on the topic: "${block.title}".
        Include:
        - A title (1 short sentence)
        - A hook (why it's cool)
        - A follow-up question to spark curiosity
        Max 150 words.`,
        context: {
          age,
          topic: block.metadata.topic
        }
      }
    });

    if (error) throw error;

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: data.text,
        isAi: true,
        blocks: await generateRelatedBlocks(block.metadata.topic, age)
      }
    }));

    toast({
      title: "✨ Let's explore!",
      description: "Here's something interesting about " + block.title,
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleContentBlock:', error);
    handleError("Couldn't generate content right now");
  }
};