import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageGenerationButton } from "./image/ImageGenerationButton";
import { GeneratedImage } from "./image/GeneratedImage";

interface ImageGeneratorProps {
  prompt: string;
}

export const ImageGenerator = ({ prompt }: ImageGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const cleanPrompt = prompt.trim();
      if (!cleanPrompt) throw new Error("Empty prompt");

      console.log("Starting image generation with prompt:", cleanPrompt);
      const requestBody = JSON.stringify({ prompt: cleanPrompt });
      console.log("Sending request with body:", requestBody);

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: requestBody
      });

      console.log("Response from generate-image:", { data, error });

      if (error) throw error;
      if (!data?.image) throw new Error("No image data in response");

      setImageUrl(data.image);
      setRetryCount(0);
      toast({
        title: "Image generated!",
        description: "Your magical creation is ready ✨",
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => generateImage(), 1000 * (retryCount + 1));
        return;
      }

      toast({
        title: "Oops!",
        description: "Couldn't create the image right now. Please try again!",
        variant: "destructive"
      });
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setIsLoading(false);
        setRetryCount(0);
      }
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <ImageGenerationButton onClick={generateImage} isLoading={isLoading} />
      {imageUrl && <GeneratedImage imageUrl={imageUrl} />}
    </div>
  );
};