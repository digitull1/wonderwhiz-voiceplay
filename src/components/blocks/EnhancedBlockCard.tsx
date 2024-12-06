import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";

interface EnhancedBlockCardProps {
  block: Block;
  index: number;
  onClick: () => void;
  gradient: string;
}

export const EnhancedBlockCard = ({ 
  block, 
  index, 
  onClick, 
  gradient 
}: EnhancedBlockCardProps) => {
  const TITLE_LIMIT = 39;
  const DESCRIPTION_LIMIT = 111;

  const truncateText = (text: string, limit: number) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + "...";
  };

  const truncatedTitle = truncateText(block.title, TITLE_LIMIT);
  const truncatedDescription = truncateText(block.description, DESCRIPTION_LIMIT);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-6 rounded-xl",
        "w-[320px] min-w-[320px] h-[180px]",
        "transition-all duration-300 relative overflow-hidden",
        "text-white snap-center group",
        "hover:shadow-xl hover:ring-2 hover:ring-white/20",
        gradient
      )}
    >
      <div className="relative z-10 h-full flex flex-col justify-between space-y-4 w-full">
        <h3 className={cn(
          "font-bold text-left transition-all duration-300",
          "leading-tight line-clamp-2",
          block.title?.length > TITLE_LIMIT - 10 ? "text-lg" : "text-xl"
        )}>
          {truncatedTitle}
        </h3>
        
        <p className={cn(
          "text-left opacity-90 transition-all duration-300",
          "leading-relaxed line-clamp-3",
          block.description?.length > DESCRIPTION_LIMIT - 20 ? "text-sm" : "text-base"
        )}>
          {truncatedDescription}
        </p>
      </div>

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

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 
        transition-colors duration-300" />
    </motion.button>
  );
};