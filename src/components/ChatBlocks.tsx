import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { BlockNavigationButton } from "./blocks/BlockNavigationButton";
import { ScrollProgressDots } from "./blocks/ScrollProgressDots";
import { EnhancedBlockCard } from "./blocks/EnhancedBlockCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { handleQuizGeneration } from "./quiz/QuizGenerator";
import { handleImageGeneration } from "./image/ImageGenerator";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks, onBlockClick }: ChatBlocksProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const isMobile = useIsMobile();
  const visibleBlocksCount = isMobile ? 1 : 3;
  const { toast } = useToast();

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
    if (block.metadata.type === 'image') {
      try {
        console.log('Generating image for prompt:', block.title);
        
        // Dispatch loading animation event
        const loadingEvent = new CustomEvent('wonderwhiz:newMessage', {
          detail: {
            text: "✨ Creating something magical for you! Watch the sparkles...",
            isAi: true,
            isLoading: true
          }
        });
        window.dispatchEvent(loadingEvent);

        await handleImageGeneration(block.title, toast);
      } catch (error) {
        console.error('Error generating image:', error);
        toast({
          title: "Oops!",
          description: "Couldn't create an image right now. Try again!",
          variant: "destructive"
        });
      }
    } else if (block.metadata.type === 'quiz') {
      try {
        console.log('Generating quiz for topic:', block.metadata.topic || block.title);
        
        // Get user's age
        const { data: userData } = await supabase.auth.getUser();
        const { data: profileData } = await supabase
          .from('profiles')
          .select('age')
          .eq('id', userData.user?.id)
          .single();

        const age = profileData?.age || 8;
        console.log('User age for quiz generation:', age);

        await handleQuizGeneration(block.metadata.topic || block.title, age, toast);
      } catch (error) {
        console.error('Error generating quiz:', error);
        toast({
          title: "Oops!",
          description: "Couldn't create a quiz right now. Try again!",
          variant: "destructive"
        });
      }
    } else {
      onBlockClick(block);
    }
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      if (!scrollContainerRef.current) return;
      const blockWidth = scrollContainerRef.current.offsetWidth / visibleBlocksCount;
      const newIndex = Math.floor(scrollContainerRef.current.scrollLeft / blockWidth);
      setCurrentScrollIndex(Math.max(0, Math.min(newIndex, blocks.length - visibleBlocksCount)));
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
      return () => container.removeEventListener('scroll', handleScrollEvent);
    }
  }, [blocks.length, visibleBlocksCount]);

  const showNavigation = blocks.length > visibleBlocksCount && !isMobile;

  return (
    <div className="relative w-full px-1">
      <AnimatePresence>
        {showNavigation && (
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
            <div 
              key={`${block.title}-${index}`}
              className={`flex-none snap-center px-1 ${
                isMobile ? 'w-full' : 'w-1/3'
              }`}
            >
              <EnhancedBlockCard
                block={block}
                index={index}
                onClick={() => handleBlockClick(block)}
              />
            </div>
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