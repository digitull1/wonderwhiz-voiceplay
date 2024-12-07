import React from "react";
import { motion } from "framer-motion";
import { ChatBlocks } from "../ChatBlocks";
import { Block } from "@/types/chat";

interface RelatedBlocksProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  show?: boolean;
}

export const RelatedBlocks = ({ blocks, onBlockClick, show = true }: RelatedBlocksProps) => {
  if (!show) return null;
  
  return (
    <motion.div 
      className="mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-small italic mb-3 text-app-text-dark">
        Want to explore more amazing facts? Check these out! ✨
      </p>
      <ChatBlocks blocks={blocks} onBlockClick={onBlockClick} />
    </motion.div>
  );
};