import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/types/chat";
import { BlockNavigationButton } from "./blocks/BlockNavigationButton";
import { ScrollProgressDots } from "./blocks/ScrollProgressDots";
import { EnhancedBlockCard } from "./blocks/EnhancedBlockCard";

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks, onBlockClick }: ChatBlocksProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const visibleBlocksCount = 1; // Show one block at a time on mobile

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const blockWidth = scrollContainerRef.current.offsetWidth * 0.9; // 90% of container width
    const scrollAmount = direction === 'left' ? -blockWidth : blockWidth;
    
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });

    const newIndex = Math.floor((scrollContainerRef.current.scrollLeft + scrollAmount) / blockWidth);
    setCurrentScrollIndex(Math.max(0, Math.min(newIndex, blocks.length - 1)));
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      if (!scrollContainerRef.current) return;
      const blockWidth = scrollContainerRef.current.offsetWidth * 0.9;
      const newIndex = Math.floor(scrollContainerRef.current.scrollLeft / blockWidth);
      setCurrentScrollIndex(Math.max(0, Math.min(newIndex, blocks.length - 1)));
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
      return () => container.removeEventListener('scroll', handleScrollEvent);
    }
  }, [blocks.length]);

  return (
    <div className="relative w-full px-4">
      <AnimatePresence>
        {blocks.length > 0 && (
          <>
            <BlockNavigationButton 
              direction="left" 
              onClick={() => handleScroll('left')} 
              className="left-2"
            />
            <BlockNavigationButton 
              direction="right" 
              onClick={() => handleScroll('right')} 
              className="right-2"
            />
          </>
        )}
      </AnimatePresence>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar"
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <EnhancedBlockCard
              key={`${block.title}-${index}`}
              block={block}
              index={index}
              onClick={() => onBlockClick(block)}
            />
          ))}
        </AnimatePresence>
      </div>

      {blocks.length > 0 && (
        <ScrollProgressDots
          totalBlocks={blocks.length}
          visibleBlocksCount={visibleBlocksCount}
          currentScrollIndex={currentScrollIndex}
        />
      )}
    </div>
  );
};