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
  const visibleBlocksCount = 3;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    const newScrollPosition = scrollContainerRef.current.scrollLeft + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    // Update current scroll index
    const newIndex = Math.floor(newScrollPosition / 320);
    setCurrentScrollIndex(Math.max(0, Math.min(newIndex, Math.ceil(blocks.length / visibleBlocksCount) - 1)));
  };

  const getBlockGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] via-[#FFA5A5]", // Red/Orange
      "bg-gradient-to-br from-[#4CABFF] to-[#6DBDFF] via-[#85CAFF]", // Blue
      "bg-gradient-to-br from-[#F4E7FE] to-[#E5D0FF] via-[#EAD9FF]"  // Purple
    ];
    return gradients[index % gradients.length];
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      if (!scrollContainerRef.current) return;
      const newIndex = Math.floor(scrollContainerRef.current.scrollLeft / 320);
      setCurrentScrollIndex(Math.max(0, Math.min(newIndex, Math.ceil(blocks.length / visibleBlocksCount) - 1)));
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
      return () => container.removeEventListener('scroll', handleScrollEvent);
    }
  }, [blocks.length, visibleBlocksCount]);

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {blocks.length > 0 && (
          <>
            <BlockNavigationButton 
              direction="left" 
              onClick={() => handleScroll('left')} 
            />
            <BlockNavigationButton 
              direction="right" 
              onClick={() => handleScroll('right')} 
            />
          </>
        )}
      </AnimatePresence>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar"
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <EnhancedBlockCard
              key={`${block.title}-${index}`}
              block={block}
              index={index}
              onClick={() => onBlockClick(block)}
              gradient={getBlockGradient(index)}
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