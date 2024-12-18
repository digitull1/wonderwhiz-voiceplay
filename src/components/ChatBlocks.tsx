import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { LoadingSparkles } from "./LoadingSparkles";
import { FEEDBACK_MESSAGES } from "@/utils/contentPrompts";
import { Sparkles } from "lucide-react";

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

  const getGradientClass = (index: number) => {
    const gradients = [
      'block-card-gradient-1',
      'block-card-gradient-2',
      'block-card-gradient-3'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="relative w-full px-4 py-2">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl z-50">
          <LoadingSparkles />
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="block-container"
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.button
              key={`${block.title}-${index}`}
              onClick={() => handleBlockClick(block, index)}
              className={`block-card ${getGradientClass(index)} ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              disabled={isLoading}
            >
              {loadingBlockId === `${block.title}-${index}` ? (
                <div className="loading-animation">
                  <Sparkles className="loading-icon" />
                </div>
              ) : (
                <>
                  <div className="block-title">
                    {index <= 2 ? '🌟' : index === 3 ? '🎨' : '🎯'} {block.title}
                  </div>
                  {block.description && (
                    <div className="block-subtitle">
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