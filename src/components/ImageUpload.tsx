import React, { useState } from 'react';
import { Button } from './ui/button';
import { ImagePlus, Loader2 } from 'lucide-react';
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
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('analyze-image', {
          body: { image: base64Image }
        });

        if (error) throw error;
        
        const response = data.choices[0].message.content;
        onImageAnalyzed(response);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
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
      className={cn("flex items-center gap-2", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-primary/10"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <ImagePlus className="h-5 w-5 text-primary" />
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