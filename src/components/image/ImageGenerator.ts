import { supabase } from "@/integrations/supabase/client";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

export const handleImageGeneration = async (prompt: string, toastFn: typeof toast) => {
  const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
    body: { prompt }
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

    toastFn({
      title: "Image created! ✨",
      description: "Here's what I imagined!",
      className: "bg-primary text-white"
    });
  }
};