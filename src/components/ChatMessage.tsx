import React from "react";
import { Button } from "./ui/button";
import { Volume2, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ChatBlocks } from "./ChatBlocks";
import { ImageGenerator } from "./ImageGenerator";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: () => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick 
}) => {
  return (
    <motion.div 
      className={`flex ${isAi ? "justify-start" : "justify-end"} mb-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isAi && (
        <motion.div 
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-purple-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
      <motion.div
        className={`max-w-[80%] p-5 rounded-2xl shadow-lg relative overflow-hidden ${
          isAi
            ? "bg-gradient-to-br from-primary/90 via-purple-500/90 to-purple-600/90 text-white"
            : "bg-gradient-to-br from-secondary/90 via-green-500/90 to-green-600/90 text-white"
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="relative z-10">
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message}</p>
          {isAi && (
            <>
              {onListen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-white hover:text-white/80 hover:bg-white/10 group"
                  onClick={onListen}
                >
                  <Volume2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Listen
                  <Star className="w-4 h-4 ml-2 text-yellow-300 animate-pulse" />
                </Button>
              )}
              <ImageGenerator prompt={message} />
            </>
          )}
          {blocks && blocks.length > 0 && onBlockClick && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ChatBlocks blocks={blocks} onBlockClick={onBlockClick} />
            </motion.div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-white rounded-full transform translate-x-16 -translate-y-16" />
        <motion.div 
          className="absolute bottom-0 left-0 w-24 h-24 opacity-10 bg-white rounded-full transform -translate-x-12 translate-y-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};