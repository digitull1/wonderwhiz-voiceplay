import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { LoadingSparkles } from "./LoadingSparkles";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks = [], onBlockClick }: ChatBlocksProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockClick = async (block: Block, index: number) => {
    setIsLoading(true);
    try {
      console.log('Block clicked:', { block, index });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to use this feature!",
          variant: "destructive"
        });
        return;
      }

      // Determine block type based on index
      const blockType = index <= 2 ? 'fact' : index === 3 ? 'image' : 'quiz';
      
      // Show loading state
      window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: "✨ Creating something magical for you! Watch the sparkles...",
          isAi: true,
          isLoading: true
        }
      }));

      // Call appropriate API based on block type
      switch (blockType) {
        case 'image':
          const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
            body: { prompt: block.metadata?.prompt || block.title }
          });
          if (imageError) throw imageError;
          
          window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
            detail: {
              text: "Here's what I imagined! What do you think? ✨",
              isAi: true,
              imageUrl: imageData.image
            }
          }));
          break;

        case 'quiz':
          const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-quiz', {
            body: { topic: block.metadata?.topic || block.title }
          });
          if (quizError) throw quizError;
          
          window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
            detail: {
              text: "Let's test your knowledge with a fun quiz! 🎯",
              isAi: true,
              quizState: {
                isActive: true,
                currentQuestion: quizData.questions[0],
                blocksExplored: 0,
                currentTopic: block.metadata?.topic || block.title
              }
            }
          }));
          break;

        default:
          const { data: contentData, error: contentError } = await supabase.functions.invoke('generate-blocks', {
            body: {
              query: block.metadata?.prompt || block.title,
              context: block.metadata?.topic || 'general'
            }
          });
          if (contentError) throw contentError;
          
          window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
            detail: {
              text: contentData.text || "Here's what I found about that! 🌟",
              isAi: true,
              blocks: contentData.blocks
            }
          }));
      }

      onBlockClick(block);
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

  if (!blocks?.length) return null;

  return (
    <div className="relative w-full px-4 py-2">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl z-50">
          <LoadingSparkles />
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.button
              key={`${block.title}-${index}`}
              onClick={() => handleBlockClick(block, index)}
              className={`
                flex-none snap-center px-6 py-3 rounded-full
                bg-gradient-to-br from-white/90 to-white/80
                shadow-luxury backdrop-blur-sm
                border border-white/20
                transition-all duration-300
                hover:shadow-xl hover:-translate-y-1
                text-sm font-medium text-gray-800
                whitespace-nowrap
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              disabled={isLoading}
            >
              {index <= 2 ? '🌟' : index === 3 ? '🎨' : '🎯'} {block.title}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};