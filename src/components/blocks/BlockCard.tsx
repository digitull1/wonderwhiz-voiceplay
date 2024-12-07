import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";

interface BlockCardProps {
  block: Block;
  index: number;
  onClick: () => void;
  color: string;
}

export const BlockCard = ({ block, index, onClick, color }: BlockCardProps) => {
  const CONTENT_LIMIT = 75;

  const truncateContent = (text: string) => {
    if (text.length <= CONTENT_LIMIT) return text;
    return text.substring(0, CONTENT_LIMIT - 3) + "...";
  };

  return (
    <motion.div
      className="snap-center px-2 py-4 w-full sm:w-[280px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-6 rounded-xl w-full h-[160px] 
          transition-all hover:shadow-block-hover shadow-block relative overflow-hidden text-white 
          snap-center group ${color} before:content-[''] before:absolute before:inset-0 
          before:bg-gradient-to-br before:from-white/20 before:to-transparent`}
      >
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h3 className="text-block-title font-bold mb-4 line-clamp-2 text-app-text-light">
            {truncateContent(block.title)}
          </h3>
          <p className="text-block-desc opacity-90 line-clamp-2 text-app-text-light">
            {block.description && !block.description.includes("Click to explore more") 
              ? block.description 
              : "Discover something amazing!"}
          </p>
        </div>
        
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 bg-white rounded-tl-full 
          transform translate-x-6 translate-y-6 group-hover:scale-110 transition-transform" />
        
        <motion.div 
          className="absolute top-2 right-2"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">✨</span>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};