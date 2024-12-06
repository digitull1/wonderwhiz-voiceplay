import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks, onBlockClick }: ChatBlocksProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const getBlockColor = (index: number) => {
    const colors = [
      "from-[#FF6B6B] to-[#FF8E8E]", // Red/Orange for exciting facts
      "from-[#4CABFF] to-[#6DBDFF]", // Blue for exploration
      "from-[#F4E7FE] to-[#E5D0FF]"  // Purple for mystery
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 
          hover:bg-white/90 transition-all duration-300 rounded-full p-2"
        onClick={() => handleScroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 
          hover:bg-white/90 transition-all duration-300 rounded-full p-2"
        onClick={() => handleScroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Blocks Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blocks.map((block, index) => (
          <motion.button
            key={`${block.title}-${index}`}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-start p-6 rounded-xl w-[300px] min-w-[300px]",
              "transition-all duration-300 relative overflow-hidden text-white snap-center",
              "hover:shadow-xl hover:ring-2 hover:ring-white/20",
              `bg-gradient-to-br ${getBlockColor(index)}`
            )}
            onClick={() => onBlockClick(block)}
          >
            <div className="relative z-10 h-full flex flex-col justify-between space-y-4">
              {/* Title with max 40 characters */}
              <h3 className="text-xl font-bold text-left">
                {block.title.length > 40 
                  ? `${block.title.substring(0, 37)}...` 
                  : block.title}
              </h3>
              
              {/* Description with max 150 characters */}
              <p className="text-sm text-left opacity-90">
                {block.description.length > 150 
                  ? `${block.description.substring(0, 147)}...` 
                  : block.description}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 
              bg-white rounded-tl-full transform translate-x-6 translate-y-6" />
            <motion.div 
              className="absolute top-2 right-2"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};