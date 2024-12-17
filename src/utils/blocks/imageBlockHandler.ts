import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "./errorHandler";

export const handleImageBlock = async (block: Block) => {
  console.log('Handling image block:', block);
  
  try {
    const safePrompt = `Generate a kid-friendly, colorful cartoon-style image about: "${block.title}". Keep it engaging and educational.`;
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt: safePrompt }
    });

    if (error) throw error;

    if (!data?.image) {
      throw new Error('No image data received');
    }

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `I've created this special illustration about "${block.title}"! What interesting things can you spot in this picture? Let's explore what we can learn from it! ✨`,
        isAi: true,
        imageUrl: data.image
      }
    }));

    toast({
      title: "Magic created! ✨",
      description: "I've made something special for you!",
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleImageBlock:', error);
    handleError("Couldn't create an image right now");
  }
};