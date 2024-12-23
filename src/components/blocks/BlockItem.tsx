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
  const blockId = `${block.title}-${index}`;
  const isBlockLoading = loadingBlockId === blockId;

  const getGradientClass = (type: string) => {
    switch (type) {
      case 'fact':
        return 'from-violet-500/90 to-purple-500/90';
      case 'image':
        return 'from-blue-500/90 to-cyan-500/90';
      case 'quiz':
        return 'from-emerald-500/90 to-teal-500/90';
      default:
        return 'from-indigo-500/90 to-blue-500/90';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'fact':
        return '🌟';
      case 'image':
        return '✨';
      case 'quiz':
        return '🎯';
      default:
        return '💡';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-2xl",
        "backdrop-blur-lg shadow-luxury border border-white/20",
        "transition-all duration-300 cursor-pointer",
        "text-white font-medium",
        "hover:scale-102 hover:-translate-y-1",
        `bg-gradient-to-br ${getGradientClass(block.metadata?.type || 'fact')}`,
        "min-w-[280px] max-w-[320px] h-auto",
        "flex flex-col justify-center items-start gap-3",
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
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl">{getBlockIcon(block.metadata?.type || 'fact')}</span>
          </div>
          <div className="space-y-2 w-full">
            <h3 className="text-lg font-semibold leading-snug tracking-tight break-words text-white">
              {block.title}
            </h3>
            {block.description && (
              <p className="text-sm text-white/90">
                {block.description}
              </p>
            )}
          </div>
        </>
      )}
    </motion.button>
  );
};