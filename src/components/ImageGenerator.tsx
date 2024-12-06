import React, { useState } from 'react';
import { Button } from './ui/button';
import { Image, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface ImageGeneratorProps {
  prompt: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ prompt }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) throw error;
      setImageUrl(data.image);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate the image. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={generateImage}
        disabled={isLoading}
        className="gap-2"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image className="h-4 w-4" />
        )}
        Generate Picture
      </Button>
      
      {imageUrl && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={imageUrl}
            alt="Generated illustration"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </motion.div>
      )}
    </motion.div>
  );
};