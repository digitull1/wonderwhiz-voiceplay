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
      {/* Navigation Buttons with improved visibility */}
      <Button
        variant="ghost"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10",
          "bg-white/90 hover:bg-white shadow-lg",
          "rounded-full p-3 transition-all duration-300",
          "border border-gray-200",
          "disabled:opacity-0"
        )}
        onClick={() => handleScroll('left')}
        disabled={!blocks.length}
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </Button>

      <Button
        variant="ghost"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10",
          "bg-white/90 hover:bg-white shadow-lg",
          "rounded-full p-3 transition-all duration-300",
          "border border-gray-200",
          "disabled:opacity-0"
        )}
        onClick={() => handleScroll('right')}
        disabled={!blocks.length}
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </Button>

      {/* Blocks Container with improved spacing */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blocks.map((block, index) => (
          <motion.button
            key={`${block.title}-${index}`}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col items-start p-6 rounded-xl",
              "w-[320px] min-w-[320px] min-h-[180px]",
              "transition-all duration-300 relative overflow-hidden",
              "text-white snap-center group",
              "hover:shadow-xl hover:ring-2 hover:ring-white/20",
              `bg-gradient-to-br ${getBlockColor(index)}`
            )}
            onClick={() => onBlockClick(block)}
          >
            <div className="relative z-10 h-full flex flex-col justify-between space-y-4 w-full">
              {/* Title with dynamic text sizing */}
              <h3 className={cn(
                "font-bold text-left transition-all duration-300",
                "text-xl leading-tight",
                block.title.length > 30 ? "text-lg" : "text-xl"
              )}>
                {block.title.length > 40 
                  ? `${block.title.substring(0, 37)}...` 
                  : block.title}
              </h3>
              
              {/* Description with dynamic text sizing */}
              <p className={cn(
                "text-left opacity-90 transition-all duration-300",
                "leading-relaxed",
                block.description.length > 100 ? "text-sm" : "text-base"
              )}>
                {block.description.length > 150 
                  ? `${block.description.substring(0, 147)}...` 
                  : block.description}
              </p>
            </div>

            {/* Enhanced visual elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 
              bg-white rounded-tl-full transform translate-x-8 translate-y-8 
              group-hover:scale-110 transition-transform duration-500" />
            
            <motion.div 
              className="absolute top-3 right-3 opacity-70 group-hover:opacity-100"
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

            {/* Hover indicator */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 
              transition-colors duration-300" />
          </motion.button>
        ))}
      </div>

      {/* Scroll progress dots */}
      {blocks.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(blocks.length / 3) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
};