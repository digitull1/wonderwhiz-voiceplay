import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageAnalyzed: (response: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageAnalyzed, 
  children, 
  className 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 4MB",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting image upload and analysis...');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        console.log('Image converted to base64, sending for analysis...');
        
        const { data, error } = await supabase.functions.invoke('analyze-image', {
          body: { 
            image: base64Image,
            prompt: "What's in this image? Explain it in a fun, educational way that's perfect for kids! Add some emojis to make it engaging!"
          }
        });

        if (error) {
          console.error('Error analyzing image:', error);
          throw error;
        }
        
        console.log('Analysis response:', data);
        if (!data?.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from analysis');
        }

        const response = data.choices[0].message.content;
        onImageAnalyzed(response);
        
        toast({
          title: "Image analyzed! 🎨",
          description: "Let me tell you what I see!",
          className: "bg-primary text-white",
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Oops!",
        description: "Failed to analyze image. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative cursor-pointer", className)}
    >
      <Button
        variant="ghost"
        className="w-full h-full p-0 hover:bg-transparent"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          children
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
      </Button>
    </motion.div>
  );
};