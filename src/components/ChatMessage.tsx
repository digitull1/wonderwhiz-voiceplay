import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { MessageActions } from "./chat/MessageActions";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { ImageGenerator } from "./ImageGenerator";
import { Sparkles } from "lucide-react";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: () => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
}

export const ChatMessage = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick 
}: ChatMessageProps) => {
  const shouldShowImageGen = message.toLowerCase().includes("look") || 
    message.toLowerCase().includes("see") || 
    message.toLowerCase().includes("picture") ||
    message.toLowerCase().includes("image") ||
    message.toLowerCase().includes("dinosaur") ||
    message.toLowerCase().includes("planet") ||
    message.toLowerCase().includes("animal");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const formattedMessage = message
    .split(/([.!?])\s*/)
    .map((part, i, arr) => {
      if (i < arr.length - 1) {
        return part + arr[i + 1] + '\n\n';
      }
      return part;
    })
    .filter((_, i) => i % 2 === 0)
    .join('')
    .replace(/(\p{Emoji}+)(?!\s)/gu, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return (
    <motion.div 
      className={cn(
        "flex mb-8 px-4 md:px-6",
        isAi ? "justify-start" : "justify-end"
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4 max-w-[85%] md:max-w-[80%] group">
        {isAi && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ChatAvatar />
          </motion.div>
        )}

        <motion.div
          className={cn(
            "space-y-4 p-6 rounded-2xl shadow-lg relative overflow-hidden",
            "transition-all duration-300",
            isAi ? 
              "bg-gradient-to-br from-chat-ai/90 to-chat-ai via-chat-ai/95 text-foreground" : 
              "bg-gradient-to-br from-chat-user/90 to-chat-user via-chat-user/95 text-foreground",
            "hover:shadow-xl",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
            "group-hover:before:opacity-100"
          )}
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <p className="text-body leading-relaxed whitespace-pre-wrap relative z-10 tracking-wide font-medium">
            {formattedMessage}
          </p>
          
          {isAi && (
            <motion.div 
              className="flex flex-col gap-4 mt-6 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MessageActions 
                onListen={onListen} 
                messageText={message} 
              />
              {shouldShowImageGen && (
                <ImageGenerator 
                  prompt={message} 
                  onResponse={(response, newBlocks) => {
                    if (blocks && onBlockClick && newBlocks) {
                      onBlockClick(newBlocks[0]);
                    }
                  }} 
                />
              )}
              {blocks && blocks.length > 0 && onBlockClick && (
                <RelatedBlocks blocks={blocks} onBlockClick={onBlockClick} />
              )}
            </motion.div>
          )}

          <motion.div 
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
            <Sparkles className="w-4 h-4 text-primary/40" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};