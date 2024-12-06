import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Block } from "@/types/chat";

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

  const getBlockGradient = (index: number) => {
    const gradients = [
      "from-[#FF6B6B] to-[#FF8E8E] via-[#FFA5A5]", // Red/Orange for exciting facts
      "from-[#4CABFF] to-[#6DBDFF] via-[#85CAFF]", // Blue for exploration
      "from-[#F4E7FE] to-[#E5D0FF] via-[#EAD9FF]"  // Purple for mystery
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="relative w-full">
      {/* Enhanced Navigation Buttons */}
      <AnimatePresence>
        {blocks.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                variant="ghost"
                className={cn(
                  "bg-white/90 hover:bg-white shadow-lg",
                  "rounded-full p-3 transition-all duration-300",
                  "border border-gray-200",
                  "group"
                )}
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                variant="ghost"
                className={cn(
                  "bg-white/90 hover:bg-white shadow-lg",
                  "rounded-full p-3 transition-all duration-300",
                  "border border-gray-200",
                  "group"
                )}
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Blocks Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar"
      >
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.button
              key={`${block.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-start p-6 rounded-xl",
                "w-[320px] min-w-[320px] h-[180px]",
                "transition-all duration-300 relative overflow-hidden",
                "text-white snap-center group",
                "hover:shadow-xl hover:ring-2 hover:ring-white/20",
                `bg-gradient-to-br ${getBlockGradient(index)}`
              )}
              onClick={() => onBlockClick(block)}
            >
              <div className="relative z-10 h-full flex flex-col justify-between space-y-4 w-full">
                {/* Dynamic Title Sizing */}
                <h3 className={cn(
                  "font-bold text-left transition-all duration-300",
                  "text-xl leading-tight",
                  block.title.length > 30 ? "text-lg" : "text-xl",
                  "line-clamp-2"
                )}>
                  {block.title.length > 40 
                    ? `${block.title.substring(0, 37)}...` 
                    : block.title}
                </h3>
                
                {/* Dynamic Description Sizing */}
                <p className={cn(
                  "text-left opacity-90 transition-all duration-300",
                  "leading-relaxed",
                  block.description.length > 100 ? "text-sm" : "text-base",
                  "line-clamp-3"
                )}>
                  {block.description.length > 150 
                    ? `${block.description.substring(0, 147)}...` 
                    : block.description}
                </p>
              </div>

              {/* Enhanced Visual Elements */}
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

              {/* Hover Indicator */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 
                transition-colors duration-300" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Scroll Progress Dots */}
      {blocks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2 mt-4"
        >
          {Array.from({ length: Math.ceil(blocks.length / 3) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === Math.floor((scrollContainerRef.current?.scrollLeft || 0) / 
                  (scrollContainerRef.current?.clientWidth || 1))
                  ? "bg-primary/70 scale-125"
                  : "bg-gray-300"
              )}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};