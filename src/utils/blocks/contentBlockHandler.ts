import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateRelatedBlocks } from "./relatedBlocksGenerator";

export const handleContentBlock = async (block: Block, age: number) => {
  console.log('Handling content block:', block);
  
  try {
    // Show loading state
    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: "✨ Creating something magical for you! Watch the sparkles...",
        isAi: true,
        isLoading: true
      }
    }));

    const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
      body: { 
        prompt: `Generate a fun, engaging fact for kids aged ${age} about: "${block.title}"
        Include:
        - A fascinating fact
        - Why it's interesting
        - A follow-up question to spark curiosity
        Max 150 words.`,
        context: {
          age,
          topic: block.metadata.topic
        }
      }
    });

    if (error) throw error;

    const blocks = await generateRelatedBlocks(block.metadata.topic, age);
    
    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: data.text,
        isAi: true,
        blocks
      }
    }));

    toast({
      title: "✨ Let's explore!",
      description: "Here's something interesting about " + block.title,
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleContentBlock:', error);
    toast({
      title: "Oops!",
      description: "Couldn't generate content right now. Try again!",
      variant: "destructive"
    });

    // Show error message to user
    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: "I encountered a small hiccup! Let's try something else! ✨",
        isAi: true
      }
    }));
  }
};