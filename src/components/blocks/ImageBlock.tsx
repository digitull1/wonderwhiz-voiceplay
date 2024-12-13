import React from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSparkles } from "../LoadingSparkles";
import { Block } from "@/types/chat";

interface ImageBlockProps {
  block: Block;
  onImageGenerated?: (imageUrl: string) => void;
}

export const ImageBlock = ({ block, onImageGenerated }: ImageBlockProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleImageGeneration = async () => {
    setIsLoading(true);
    try {
      // Create a child-friendly prompt based on the block title
      const safePrompt = `Create a child-friendly, educational, and colorful illustration of: ${block.title}. 
        Make it engaging and suitable for children.`;

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: safePrompt }
      });

      if (error) throw error;

      if (data?.image) {
        onImageGenerated?.(data.image);
        toast({
          title: "✨ Image created!",
          description: "Here's what I imagined for you!",
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
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleImageGeneration}
      className="w-full p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                 rounded-lg border border-white/10 backdrop-blur-sm
                 hover:scale-105 transition-all duration-300
                 flex flex-col items-center justify-center gap-3"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSparkles />
      ) : (
        <>
          <span className="text-3xl mb-2">🎨</span>
          <h3 className="text-lg font-semibold text-white text-center">
            Create a picture about:
          </h3>
          <p className="text-white/90 text-center">
            {block.title.replace('🎨', '').trim()}
          </p>
        </>
      )}
    </motion.button>
  );
};