import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import { GeneratedImage } from './image/GeneratedImage';

interface ImageGeneratorProps {
  prompt: string;
}

export const ImageGenerator = ({ prompt }: ImageGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsLoading(true);
    try {
      console.log('Generating image for prompt:', prompt);
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      if (data?.image) {
        console.log('Image generated successfully');
        setImageUrl(data.image);
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