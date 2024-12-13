import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageBlock } from "./ImageBlock";
import { QuizBlock } from "./QuizBlock";

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
  const isMobile = useIsMobile();
  
  const getBlockGradient = () => {
    const gradients = [
      "from-purple-500/20 to-pink-500/20",
      "from-blue-500/20 to-purple-500/20",
      "from-green-500/20 to-blue-500/20"
    ];
    return gradients[index % gradients.length];
  };

  const renderBlockContent = () => {
    switch (block.metadata?.type) {
      case 'image':
        return (
          <div className="space-y-2 text-center">
            <span className="text-2xl">🎨</span>
            <p className="text-sm font-medium">
              Create an amazing picture about:
              <span className="block mt-1 text-white/90 font-semibold">
                {block.title.replace('🎨', '').trim()}
              </span>
            </p>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-2 text-center">
            <span className="text-2xl">🎯</span>
            <p className="text-sm font-medium">
              Test your knowledge about:
              <span className="block mt-1 text-white/90 font-semibold">
                {block.title.replace('🎯', '').trim()}
              </span>
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <h3 className="text-block-title font-semibold leading-snug 
              tracking-tight break-words text-left max-w-full">
              {block.title}
            </h3>
            {block.description && (
              <p className="text-sm text-white/80">{block.description}</p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isMobile ? { scale: 1.02, y: -5 } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-center items-center w-full",
        "min-h-[120px] p-4 sm:p-5",
        "rounded-xl transition-all duration-300",
        "relative overflow-hidden text-white",
        "shadow-block hover:shadow-xl border border-white/20",
        "bg-gradient-to-br cursor-pointer",
        getBlockGradient(),
        isMobile && "text-left"
      )}
    >
      <div className="relative z-10">
        {renderBlockContent()}
      </div>

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