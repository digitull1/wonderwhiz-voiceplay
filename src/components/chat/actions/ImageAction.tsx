import React, { useState } from "react";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageActionProps {
  messageText: string;
}

export const ImageAction = ({ messageText }: ImageActionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleImageGeneration = async () => {
    if (!messageText?.trim()) {
      toast({
        title: "Oops!",
        description: "I need some context to create an image. Try asking a question first!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    console.log('Generating image for prompt:', messageText);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: messageText }
      });

      if (error) throw error;

      console.log('Image generation response:', data);

      if (data?.image) {
        console.log('Image generated successfully:', data.image);
        
        const event = new CustomEvent('wonderwhiz:newMessage', {
          detail: {
            text: "Here's the image I created based on your request! What do you think? ✨",
            isAi: true,
            imageUrl: data.image
          }
        });
        window.dispatchEvent(event);

        toast({
          title: "Image created! ✨",
          description: "Here's what I imagined!",
          className: "bg-primary text-white"
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Oops!",
        description: "Couldn't create an image right now. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleImageGeneration}
      disabled={isGenerating}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "hover:bg-white hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
      )}
    >
      <ImageIcon className="w-4 h-4" />
    </Button>
  );
};