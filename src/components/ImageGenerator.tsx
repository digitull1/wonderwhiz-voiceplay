import React, { useState } from 'react';
import { Button } from './ui/button';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import { GeneratedImage } from './image/GeneratedImage';
import { useBlockGeneration } from '@/hooks/useBlockGeneration';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGeneratorProps {
  prompt: string;
  onResponse: (response: string, blocks?: any[], imageUrl?: string) => void;
}

export const ImageGenerator = ({ prompt, onResponse }: ImageGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { generateDynamicBlocks } = useBlockGeneration(null);

  const generateImage = async () => {
    setIsLoading(true);
    try {
      console.log('Generating image for prompt:', prompt);
      
      // Make the function call to generate image
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          age_group: "8-12" // Default age group if not specified
        }
      });

      if (imageError) {
        console.error('Error details:', imageError);
        throw imageError;
      }

      if (imageData?.image) {
        console.log('Image generated successfully:', imageData.image);
        setImageUrl(imageData.image);

        // Analyze the generated image
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-image', {
          body: { 
            image: imageData.image,
            prompt: "What's in this image? Explain it in a fun, educational way!"
          }
        });

        if (analysisError) {
          console.error('Analysis error:', analysisError);
          throw analysisError;
        }

        const response = analysisData.choices[0].message.content;
        console.log('Image analysis response:', response);

        const blocks = await generateDynamicBlocks(response, "image analysis");
        console.log('Generated blocks:', blocks);

        onResponse(response, blocks, imageData.image);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast({
        title: "Image Generation Failed",
        description: "Sorry, I couldn't create an image this time. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="mb-4"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary font-medium text-center"
            >
              Creating something magical... ✨
            </motion.p>
          </motion.div>
        ) : (
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-lg"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Image
          </Button>
        )}
      </AnimatePresence>
      
      {imageUrl && <GeneratedImage imageUrl={imageUrl} />}
    </div>
  );
};