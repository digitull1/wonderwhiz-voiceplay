import React from "react";
import { motion } from "framer-motion";
import { ChatBlocks } from "../ChatBlocks";
import { Block } from "@/types/chat";
import { Sparkles } from "lucide-react";

interface RelatedBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  show?: boolean;
}

export const RelatedBlocks = ({ blocks, onBlockClick, show = true }: RelatedBlocksProps) => {
  if (!show) return null;
  
  return (
    <motion.div 
      className="mt-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.3,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {/* Decorative Elements */}
      <motion.div 
        className="absolute -top-4 -left-2"
        animate={{ 
          rotate: [0, 180, 360],
          scale: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Sparkles className="w-4 h-4 text-primary/40" />
      </motion.div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl -z-10"
        animate={{ 
          opacity: [0.3, 0.1, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.p 
        className="text-small italic mb-3 text-app-text-dark/80 font-display"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        Want to explore more amazing facts? Check these out! ✨
      </motion.p>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChatBlocks 
          blocks={blocks} 
          onBlockClick={onBlockClick} 
        />
      </motion.div>
    </motion.div>
  );
};