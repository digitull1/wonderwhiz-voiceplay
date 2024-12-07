import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ArrowRight } from "lucide-react";

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
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-between w-full min-h-[120px] p-4",
        "rounded-2xl transition-all duration-300",
        "relative overflow-hidden text-white",
        "shadow-lg hover:shadow-xl border border-white/20",
        "bg-gradient-to-br cursor-pointer",
        "active:scale-95",
        getBlockGradient()
      )}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <h3 className="text-[15px] md:text-[16px] font-semibold leading-snug 
          tracking-tight line-clamp-2 text-left">
          {block.title}
        </h3>
      </div>

      <motion.div 
        className="flex items-center mt-2 text-sm font-medium opacity-80 
          group-hover:opacity-100 transition-opacity"
        initial={false}
        animate={{ x: 0 }}
        whileHover={{ x: 5 }}
      >
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </motion.div>

      {/* Interactive background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
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