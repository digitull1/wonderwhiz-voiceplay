import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlockContainer } from "./blocks/BlockContainer";
import { BlockItem } from "./blocks/BlockItem";
import { BlockErrorBoundary } from "./blocks/BlockErrorBoundary";
import { CelebrationAnimation } from "./CelebrationAnimation";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks = [], onBlockClick }: ChatBlocksProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

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

      const blockType = block.metadata?.type || 'fact';
      
      try {
        switch (blockType) {
          case 'image':
            const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
              body: { 
                prompt: `Create a child-friendly, whimsical illustration of: ${block.metadata?.prompt || block.title}. 
                Make it colorful, engaging, and suitable for children.`,
                age_group: "8-12"
              }
            });
            
            if (imageError) throw imageError;
            
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
            
            window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
              detail: {
                text: "Here's what I imagined! What interesting things can you spot? 🎨",
                isAi: true,
                imageUrl: imageData.image
              }
            }));
            break;

          case 'quiz':
          case 'quiz-teaser':
            const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-quiz', {
              body: { 
                topic: block.metadata?.topic || block.title,
                age: 8,
                contextualPrompt: `Create 5 fun, engaging multiple-choice questions about "${block.metadata?.topic || block.title}" 
                for children. Include one silly option in each question to make it entertaining!`
              }
            });
            
            if (quizError) throw quizError;
            
            window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
              detail: {
                text: "Let's test your knowledge with a fun quiz! 🎯",
                isAi: true,
                quizState: {
                  isActive: true,
                  currentQuestion: quizData.questions,
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
                context: block.metadata?.topic || 'general',
                age_group: "8-12"
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

        toast({
          title: "Success! 🎉",
          description: "Your content is ready to explore!",
          className: "bg-primary text-white"
        });

      } catch (error) {
        console.error('Error handling block interaction:', error);
        window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
          detail: {
            text: "Oops! Something went wrong. Let's try something else! ✨",
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

  return (
    <BlockErrorBoundary>
      <BlockContainer isLoading={isLoading}>
        <AnimatePresence>
          {blocks.map((block, index) => (
            <BlockItem
              key={`${block.title}-${index}`}
              block={block}
              index={index}
              onClick={() => handleBlockClick(block, index)}
              isLoading={isLoading}
              loadingBlockId={loadingBlockId}
            />
          ))}
        </AnimatePresence>
      </BlockContainer>
      {showCelebration && <CelebrationAnimation />}
    </BlockErrorBoundary>
  );
};