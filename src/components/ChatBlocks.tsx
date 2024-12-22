import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { LoadingAnimation } from "./LoadingAnimation";
import { FEEDBACK_MESSAGES } from "@/utils/contentPrompts";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks = [], onBlockClick }: ChatBlocksProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null);

  const handleBlockClick = async (block: Block, index: number) => {
    const blockId = `${block.title}-${index}`;
    setLoadingBlockId(blockId);
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to use this feature!",
          variant: "destructive"
        });
        return;
      }

      // Show loading message
      window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: "✨ Creating something magical for you! Watch the sparkles...",
          isAi: true,
          isLoading: true
        }
      }));

      const blockType = index <= 2 ? 'fact' : index === 3 ? 'image' : 'quiz';
      
      try {
        switch (blockType) {
          case 'image':
            const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
              body: { 
                prompt: block.metadata?.prompt || block.title,
                age_group: "8-12"
              }
            });
            
            if (imageError) throw imageError;
            
            // Show success animation
            showCelebrationAnimation();
            
            window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
              detail: {
                text: "Here's what I imagined! What interesting things can you spot? 🎨",
                isAi: true,
                imageUrl: imageData.image
              }
            }));
            break;

          case 'quiz':
            const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-quiz', {
              body: { 
                topic: block.metadata?.topic || block.title,
                age: 8
              }
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
                text: contentData.text || "Here's what I found! Want to explore more? 🌟",
                isAi: true,
                blocks: contentData.blocks
              }
            }));
        }

        // Show success toast
        toast({
          title: "Success! 🎉",
          description: "Your content is ready to explore!",
          className: "bg-primary text-white"
        });

      } catch (error) {
        console.error('Error handling block interaction:', error);
        window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
          detail: {
            text: FEEDBACK_MESSAGES.ERROR[blockType.toUpperCase() as keyof typeof FEEDBACK_MESSAGES.ERROR],
            isAi: true
          }
        }));
      }

      onBlockClick(block);
    } catch (error) {
      console.error('Error in block click handler:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Let's try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoadingBlockId(null);
    }
  };

  const showCelebrationAnimation = () => {
    // Import confetti dynamically to avoid SSR issues
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      'bg-gradient-block-1',
      'bg-gradient-block-2',
      'bg-gradient-block-3'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="relative w-full px-4 py-2">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl z-50">
          <LoadingAnimation />
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar"
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.button
              key={`${block.title}-${index}`}
              onClick={() => handleBlockClick(block, index)}
              className={cn(
                "flex-none snap-center px-6 py-3 rounded-xl",
                "backdrop-blur-sm border border-white/20",
                "transition-all duration-300 cursor-pointer",
                "text-sm font-medium text-white whitespace-nowrap",
                "hover:scale-102 hover:-translate-y-1",
                getGradientClass(index),
                "min-w-[280px] max-w-[320px]",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              disabled={isLoading}
            >
              {loadingBlockId === `${block.title}-${index}` ? (
                <LoadingAnimation />
              ) : (
                <>
                  <div className="text-block-title font-bold mb-1 line-clamp-2">
                    {index <= 2 ? '🌟' : index === 3 ? '🎨' : '🎯'} {block.title}
                  </div>
                  {block.description && (
                    <div className="text-block-desc text-white/80 line-clamp-2">
                      {block.description}
                    </div>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};