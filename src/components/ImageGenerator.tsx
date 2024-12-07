import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import { GeneratedImage } from './image/GeneratedImage';
import { useBlockGeneration } from '@/hooks/useBlockGeneration';

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
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (imageError) {
        console.error('Error generating image:', imageError);
        throw imageError;
      }

      if (imageData?.image) {
        console.log('Image generated successfully');
        setImageUrl(imageData.image);

        // Get image analysis with WonderWhiz style response
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-image', {
          body: { 
            image: imageData.image,
            prompt: "What's in this image? Explain it in a fun, educational way!"
          }
        });

        if (analysisError) throw analysisError;

        const response = analysisData.choices[0].message.content;
        console.log('Image analysis response:', response);

        // Generate contextual blocks based on the analysis
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
      <Button
        onClick={generateImage}
        disabled={isLoading}
        className="bg-secondary hover:bg-secondary/90 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>
      
      {imageUrl && <GeneratedImage imageUrl={imageUrl} />}
    </div>
  );
};