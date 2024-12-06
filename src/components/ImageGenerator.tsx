import React, { useState } from "react";
import { Button } from "./ui/button";
import { Image, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
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
      console.log("Starting image generation with prompt:", prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (!data?.image) {
        throw new Error("No image data received");
      }

      console.log("Image generation successful");
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
        setTimeout(() => generateImage(), 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      toast({
        title: "Oops!",
        description: "Couldn't create the image right now. Please try again in a moment!",
        variant: "destructive",
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={generateImage}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2 relative overflow-hidden group"
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
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      {retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRIES})` : "Creating magic..."}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Image className="w-5 h-5" />
                      Generate Picture
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to create an amazing picture based on our chat!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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