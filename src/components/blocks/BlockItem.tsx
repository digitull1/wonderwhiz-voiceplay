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
  const getGradientClass = (index: number) => {
    const gradients = [
      'bg-gradient-block-1',
      'bg-gradient-block-2',
      'bg-gradient-block-3'
    ];
    return gradients[index % gradients.length];
  };

  const blockId = `${block.title}-${index}`;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex-none snap-center px-6 py-3 rounded-xl",
        "backdrop-blur-sm border border-white/20",
        "transition-all duration-300 cursor-pointer",
        "text-sm font-medium text-white whitespace-nowrap",
        "hover:scale-102 hover:-translate-y-1",
        getGradientClass(index),
        "min-w-[280px] max-w-[320px]",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      disabled={isLoading}
    >
      {loadingBlockId === blockId ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="text-block-title font-bold mb-1 line-clamp-2">
            {index <= 2 ? '🌟' : index === 3 ? '🎨' : '🎯'} {block.title}
          </div>
          {block.description && (
            <div className="text-block-desc text-white/80 line-clamp-2">
              {block.description}
            </div>
          )}
        </>
      )}
    </motion.button>
  );
};