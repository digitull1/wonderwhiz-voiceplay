import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChevronRight } from "lucide-react";

interface EnhancedBlockCardProps {
  block: Block;
  index: number;
  onClick: () => void;
}

export const EnhancedBlockCard = ({ 
  block, 
  index, 
  onClick 
}: EnhancedBlockCardProps) => {
  const CONTENT_LIMIT = 75;

  const truncateContent = (text: string | undefined) => {
    if (!text) return "";
    if (text.length <= CONTENT_LIMIT) return text;
    return text.substring(0, CONTENT_LIMIT - 3) + "...";
  };

  const getBlockGradient = () => {
    const gradients = [
      "from-[#FF6B6B] to-[#FF8E8E]", // Warm Red
      "from-[#4CABFF] to-[#6DBDFF]", // Ocean Blue
      "from-[#BFAAFF] to-[#E5D0FF]"  // Soft Purple
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col justify-between p-4 rounded-2xl w-full",
        "min-h-[110px] transition-all duration-300",
        "relative overflow-hidden text-white snap-center group",
        "shadow-lg hover:shadow-xl border border-white/20",
        "bg-gradient-to-br",
        getBlockGradient()
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-left">
          {truncateContent(block.title)}
        </h3>
        <p className="text-[13px] opacity-90 line-clamp-2 text-left">
          {block.description || "Click to explore more!"}
        </p>
      </div>

      <div className="flex items-center justify-end mt-2 text-sm font-medium">
        Read More
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
    </motion.button>
  );
};