import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressDotsProps {
  totalBlocks: number;
  visibleBlocksCount: number;
  currentScrollIndex: number;
}

export const ScrollProgressDots = ({ 
  totalBlocks, 
  visibleBlocksCount, 
  currentScrollIndex 
}: ScrollProgressDotsProps) => {
  const dotsCount = Math.ceil(totalBlocks / visibleBlocksCount);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-2 mt-4"
    >
      {Array.from({ length: dotsCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            i === currentScrollIndex
              ? "bg-primary/70 scale-125"
              : "bg-gray-300"
          )}
        />
      ))}
    </motion.div>
  );
};