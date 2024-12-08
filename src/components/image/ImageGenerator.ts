import { supabase } from "@/integrations/supabase/client";
import { Toast } from "@/components/ui/use-toast";

export const handleImageGeneration = async (prompt: string, toast: Toast) => {
  const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
    body: JSON.stringify({ prompt })
  });

  if (imageError) throw imageError;

  if (imageData?.image) {
    const event = new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: "Here's what I imagined based on your request! What do you think? ✨",
        isAi: true,
        imageUrl: imageData.image
      }
    });
    window.dispatchEvent(event);

    toast({
      title: "Image created! ✨",
      description: "Here's what I imagined!",
      className: "bg-primary text-white"
    });
  }
};