import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlockCardProps {
  block: Block;
  index: number;
  onClick: () => void;
  color: string;
}

export const BlockCard = ({ block, index, onClick, color }: BlockCardProps) => {
  const isMobile = useIsMobile();
  const CONTENT_LIMIT = 75;

  const truncateContent = (text: string) => {
    if (text.length <= CONTENT_LIMIT) return text;
    return text.substring(0, CONTENT_LIMIT - 3) + "...";
  };

  return (
    <motion.div
      className="snap-center w-full px-2 py-4 sm:w-[280px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.button
        onClick={onClick}
        className={`block-hover flex flex-col items-center justify-center p-6 
          rounded-xl w-full h-[160px] transition-all hover:shadow-block 
          shadow-block relative overflow-hidden text-white snap-center 
          group ${color}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: index * 0.1
        }}
      >
        <div className="relative z-10 h-full flex flex-col items-center 
          justify-center text-center space-y-3">
          <h3 className="text-block-title font-bold line-clamp-2 
            text-app-text-light">
            {truncateContent(block.title)}
          </h3>
          {block.description && !block.description.includes("Click to explore") && (
            <p className="text-block-desc opacity-90 line-clamp-2 
              text-app-text-light">
              {block.description}
            </p>
          )}
        </div>
        
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 
          bg-white rounded-tl-full transform translate-x-6 translate-y-6 
          group-hover:scale-110 transition-transform duration-500" />
        
        <motion.div 
          className="absolute top-2 right-2 opacity-70 group-hover:opacity-100"
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
    </motion.div>
  );
};