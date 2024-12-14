import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";
import { cn } from "@/lib/utils";
import { handleImageBlock, handleQuizBlock } from "@/utils/blockHandlers";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlockCardProps {
  block: Block;
  index: number;
  onClick: () => void;
  color?: string;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  index,
  onClick,
  color = "bg-gradient-to-br from-primary/20 to-secondary/20"
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to interact with blocks!",
          variant: "destructive"
        });
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', user.id)
        .single();

      const age = profileData?.age || 8;

      if (block.metadata?.type === 'image') {
        await handleImageBlock(block);
      } else if (block.metadata?.type === 'quiz') {
        await handleQuizBlock(block, age);
      } else {
        onClick();
      }
    } catch (error) {
      console.error('Error handling block click:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again!",
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
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full"
    >
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "w-full p-6 rounded-xl border border-white/10",
          "backdrop-blur-sm shadow-luxury hover:shadow-luxury-hover",
          "transition-all duration-300 ease-in-out",
          "flex flex-col items-start gap-2 text-left",
          color,
          isLoading && "animate-pulse"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h3 className="text-lg font-semibold text-white">
          {block.title}
        </h3>
        {block.description && (
          <p className="text-sm text-white/80">
            {block.description}
          </p>
        )}
        {block.metadata?.type && (
          <div className="mt-2 text-xs text-white/60">
            {block.metadata.type === 'image' && '🎨 Click to generate an image'}
            {block.metadata.type === 'quiz' && '🎯 Click to start a quiz'}
            {block.metadata.type === 'fact' && '🌟 Click to learn more'}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};