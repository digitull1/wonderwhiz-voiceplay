import React, { useState } from "react";
import { Button } from "./ui/button";
import { Image, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // Clean and validate prompt
      const cleanPrompt = prompt.trim();
      if (!cleanPrompt) {
        throw new Error("Empty prompt");
      }

      console.log("Starting image generation with prompt:", cleanPrompt);
      
      // Prepare request body and stringify it
      const requestBody = JSON.stringify({ prompt: cleanPrompt });
      console.log("Sending request with body:", requestBody);

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: requestBody
      });

      console.log("Response from generate-image:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (!data?.image) {
        throw new Error("No image data in response");
      }

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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={generateImage}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                Creating magic...
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Generate Picture
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {imageUrl && (
        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt="Generated content"
          className="w-full rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};