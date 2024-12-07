import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { MessageActions } from "./chat/MessageActions";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { ImageGenerator } from "./ImageGenerator";
import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";

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
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const handleListen = () => {
    if (onListen) {
      onListen();
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
        "flex mb-2 px-2 w-full",
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
        "flex items-start gap-2 max-w-[95%] group",
        isAi ? "w-full" : "w-full"
      )}>
        {isAi && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex-shrink-0 mt-1"
          >
            <ChatAvatar />
          </motion.div>
        )}

        <motion.div
          className={cn(
            "space-y-2 p-3 rounded-2xl shadow-sm relative overflow-hidden min-h-[48px] w-full",
            isAi ? 
              "bg-gradient-to-br from-[#E8E8FF]/95 via-[#F4F4FF]/97 to-[#FFFFFF]/95 rounded-tl-sm border border-[#E8E8FF]/50" : 
              "bg-gradient-to-br from-[#FFFFFF]/95 via-[#FAFAFA]/97 to-[#F8F8F8]/95 rounded-tr-sm border border-gray-100/50",
            "active:scale-[0.995] transition-all duration-200"
          )}
          layout
        >
          <p className="text-[14px] leading-[1.4] whitespace-pre-wrap relative z-10 
            tracking-wide font-medium text-gray-800">
            {formattedMessage}
          </p>
          
          {isAi && (
            <Button
              onClick={handleListen}
              size="sm"
              variant="ghost"
              className="absolute top-2.5 right-2.5 opacity-70 hover:opacity-100 
                cursor-pointer transition-all p-1.5 rounded-full hover:bg-white/50
                active:scale-95"
              aria-label="Listen to message"
            >
              <Volume2 className="w-4 h-4 text-primary" />
            </Button>
          )}
          
          {isAi && (
            <motion.div 
              className="flex flex-col gap-3 mt-3 relative z-10"
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

          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 pointer-events-none" />
        </motion.div>
      </div>
    </motion.div>
  );
};