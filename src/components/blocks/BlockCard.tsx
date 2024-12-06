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
  return (
    <motion.div
      className="snap-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={onClick}
        className={`flex flex-col items-start p-6 rounded-xl w-[280px] min-w-[280px] h-[160px] 
          transition-all hover:shadow-xl relative overflow-hidden text-white snap-center group
          ${color} before:content-[''] before:absolute before:inset-0 
          before:bg-gradient-to-br before:from-white/20 before:to-transparent`}
      >
        <div className="relative z-10 h-full flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2 text-left line-clamp-2">{block.title}</h3>
          <p className="text-sm text-left opacity-90 line-clamp-2">{block.description}</p>
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