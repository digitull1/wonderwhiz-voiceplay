import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface ChatBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export const ChatBlocks = ({ blocks, onBlockClick }: ChatBlocksProps) => {
  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-purple-600 to-blue-700",
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-indigo-600 to-purple-700",
      "bg-gradient-to-br from-green-500 to-emerald-700",
      "bg-gradient-to-br from-orange-500 to-red-700"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {blocks.map((block, index) => (
        <motion.button
          key={`${block.title}-${index}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex flex-col items-start p-6 rounded-xl w-[280px] min-w-[280px] h-[160px] transition-all",
            "hover:shadow-xl relative overflow-hidden text-white snap-center",
            block.color || getRandomGradient(),
            "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent"
          )}
          onClick={() => onBlockClick(block)}
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-2 text-left line-clamp-2">{block.title}</h3>
            <p className="text-sm text-left opacity-90 line-clamp-2">{block.description}</p>
          </div>
          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 bg-white rounded-tl-full transform translate-x-6 translate-y-6" />
          <motion.div 
            className="absolute top-2 right-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
};