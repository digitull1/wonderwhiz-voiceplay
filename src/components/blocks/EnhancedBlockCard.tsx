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
  const CONTENT_LIMIT = 75;

  const truncateContent = (text: string) => {
    if (!text) return "";
    if (text.length <= CONTENT_LIMIT) return text;
    return text.substring(0, CONTENT_LIMIT - 3) + "...";
  };

  // Get topic-based gradient
  const getTopicGradient = (topic: string) => {
    const topics: Record<string, string> = {
      science: "from-[#4CABFF] to-[#5EC4FF]",
      history: "from-[#FFAB4C] to-[#FF6B6B]",
      space: "from-[#F4E7FE] to-[#DABFFF]",
      default: "from-[#4ECDC4] to-[#6EE7E7]"
    };
    return topics[topic.toLowerCase()] || topics.default;
  };

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
        "flex items-center justify-center p-6 rounded-xl",
        "w-[400px] min-w-[400px] h-[120px]",
        "transition-all duration-300 relative overflow-hidden",
        "text-white snap-center group",
        "hover:shadow-xl hover:ring-2 hover:ring-white/20",
        "bg-gradient-to-br",
        getTopicGradient(block.metadata?.topic || 'default')
      )}
    >
      <p className={cn(
        "font-bold text-center transition-all duration-300",
        "text-[20px] leading-tight font-poppins tracking-wide",
        "px-4"
      )}>
        {truncateContent(block.title)}
      </p>

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