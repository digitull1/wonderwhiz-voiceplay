import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { BlockNavigationButton } from "./blocks/BlockNavigationButton";
import { ScrollProgressDots } from "./blocks/ScrollProgressDots";
import { EnhancedBlockCard } from "./blocks/EnhancedBlockCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { handleImageBlock, handleQuizBlock } from "@/utils/blockHandlers";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks = [], onBlockClick }: ChatBlocksProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const isMobile = useIsMobile();
  const visibleBlocksCount = isMobile ? 1 : 3;
  const { toast } = useToast();

  useEffect(() => {
    console.log('ChatBlocks received blocks:', {
      blocksLength: blocks?.length,
      blocks: blocks
    });
  }, [blocks]);

  if (!blocks?.length) {
    console.log('No blocks to display');
    return null;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const blockWidth = scrollContainerRef.current.offsetWidth / visibleBlocksCount;
    const scrollAmount = direction === 'left' ? -blockWidth : blockWidth;
    
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });

    const newIndex = Math.floor((scrollContainerRef.current.scrollLeft + scrollAmount) / blockWidth);
    setCurrentScrollIndex(Math.max(0, Math.min(newIndex, blocks.length - visibleBlocksCount)));
  };

  const handleBlockClick = async (block: Block) => {
    console.log('Block clicked:', block);

    if (!block.metadata?.type) {
      onBlockClick(block);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to use this feature!",
          variant: "destructive"
        });
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', userData.user.id)
        .single();

      const age = profileData?.age || 8;
      console.log('User age for content generation:', age);

      // Show loading state in chat
      window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: "✨ Creating something magical for you! Watch the sparkles...",
          isAi: true,
          isLoading: true
        }
      }));

      if (block.metadata.type === 'image') {
        console.log('Generating image with block:', block);
        await handleImageBlock(block);
      } else if (block.metadata.type === 'quiz') {
        console.log('Generating quiz with block:', block);
        await handleQuizBlock(block, age);
      }
    } catch (error) {
      console.error('Error handling block click:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again!",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative w-full px-1">
      <AnimatePresence>
        {blocks.length > visibleBlocksCount && !isMobile && (
          <>
            <BlockNavigationButton 
              direction="left" 
              onClick={() => handleScroll('left')} 
              className="left-0 z-10"
              disabled={currentScrollIndex === 0}
            />
            <BlockNavigationButton 
              direction="right" 
              onClick={() => handleScroll('right')} 
              className="right-0 z-10"
              disabled={currentScrollIndex >= blocks.length - visibleBlocksCount}
            />
          </>
        )}
      </AnimatePresence>

      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div 
              key={`${block.title}-${index}`}
              className={cn(
                "flex-none snap-center px-1",
                isMobile ? "w-full" : "w-1/3"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedBlockCard
                block={block}
                index={index}
                onClick={() => handleBlockClick(block)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {blocks.length > visibleBlocksCount && (
        <ScrollProgressDots
          totalBlocks={blocks.length}
          visibleBlocksCount={visibleBlocksCount}
          currentScrollIndex={currentScrollIndex}
        />
      )}
    </div>
  );
};