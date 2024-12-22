import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";
import { cn } from "@/lib/utils";
import { LoadingAnimation } from "../LoadingAnimation";

interface BlockItemProps {
  block: Block;
  index: number;
  onClick: () => void;
  isLoading: boolean;
  loadingBlockId: string | null;
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  onClick,
  isLoading,
  loadingBlockId
}) => {
  const getGradientClass = (type: string) => {
    const gradients = {
      fact: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      exploration: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20',
      'quiz-teaser': 'bg-gradient-to-br from-green-500/20 to-blue-500/20',
      image: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      quiz: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
    };
    return gradients[block.metadata?.type || 'fact'];
  };

  const blockId = `${block.title}-${index}`;
  const isBlockLoading = loadingBlockId === blockId;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex-none snap-center px-6 py-4 rounded-xl",
        "backdrop-blur-sm border border-white/20",
        "transition-all duration-300 cursor-pointer",
        "text-sm font-medium text-white",
        "hover:scale-102 hover:-translate-y-1",
        getGradientClass(block.metadata?.type || 'fact'),
        "min-w-[280px] max-w-[320px] h-[120px]",
        "flex flex-col justify-center items-start gap-2",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      disabled={isLoading}
    >
      {isBlockLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="text-block-title font-bold mb-1 line-clamp-2 text-left">
            {block.title}
          </div>
          {block.description && (
            <div className="text-block-desc text-white/80 line-clamp-2 text-left">
              {block.description}
            </div>
          )}
          <div className="absolute bottom-3 right-3 opacity-70 group-hover:opacity-100">
            <motion.span
              className="text-2xl"
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
              {block.metadata?.type === 'fact' ? '🌟' : 
               block.metadata?.type === 'exploration' ? '🔍' : 
               block.metadata?.type === 'quiz-teaser' ? '💭' :
               block.metadata?.type === 'image' ? '🎨' : 
               block.metadata?.type === 'quiz' ? '🎯' : '✨'}
            </motion.span>
          </div>
        </>
      )}
    </motion.button>
  );
};