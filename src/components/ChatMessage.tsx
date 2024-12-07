import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { MessageActions } from "./chat/MessageActions";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { ImageGenerator } from "./ImageGenerator";
import { Sparkles, Speaker } from "lucide-react";

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

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
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
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9 }}
      variants={messageVariants}
      whileHover="hover"
      layout
    >
      <div className={cn(
        "flex items-start gap-4",
        isAi ? "max-w-[95%]" : "max-w-[90%]",
        "md:max-w-[80%] group"
      )}>
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
              "bg-gradient-to-br from-[#E8E8FF]/90 via-[#F4F4FF]/95 to-[#FFFFFF]/90 text-foreground" : 
              "bg-gradient-to-br from-[#FFFFFF]/90 via-[#FAFAFA]/95 to-[#F8F8F8]/90 text-foreground",
            "hover:shadow-xl min-h-[48px]"
          )}
          layout
        >
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap relative z-10 
            tracking-wide font-medium md:text-[16px]">
            {formattedMessage}
          </p>
          
          {isAi && onListen && (
            <motion.div 
              className="absolute top-3 right-3 opacity-70 hover:opacity-100 
                cursor-pointer transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onListen}
            >
              <Speaker className="w-4 h-4 text-primary" />
            </motion.div>
          )}
          
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
        </motion.div>
      </div>
    </motion.div>
  );
};
