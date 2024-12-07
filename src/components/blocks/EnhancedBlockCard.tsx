import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";

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
      "from-block-purple to-block-blue",
      "from-block-blue to-block-orange",
      "from-block-orange to-block-purple"
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
        "group flex flex-col justify-between w-full min-h-[140px] p-5",
        "rounded-2xl transition-all duration-300",
        "relative overflow-hidden text-white",
        "shadow-block hover:shadow-xl border border-white/20",
        "bg-gradient-to-br cursor-pointer",
        getBlockGradient()
      )}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <h3 className="text-block-title font-semibold leading-snug 
          tracking-tight break-words text-left max-w-full">
          {block.title}
        </h3>
        {block.description && !block.description.includes("Click to explore") && (
          <p className="text-block-desc opacity-90 font-medium">
            {block.description}
          </p>
        )}
      </div>

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