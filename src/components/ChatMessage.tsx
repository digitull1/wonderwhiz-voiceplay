import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { MessageActions } from "./chat/MessageActions";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { ImageGenerator } from "./ImageGenerator";

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
    .split(/([.!?])\s+/)
    .map((part, i, arr) => i < arr.length - 1 ? part + arr[i + 1] : part)
    .filter((_, i) => i % 2 === 0)
    .join('\n');

  return (
    <motion.div 
      className={`flex ${isAi ? "justify-start" : "justify-end"} mb-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3 max-w-[80%]">
        {isAi && <ChatAvatar />}

        <motion.div
          className={cn(
            "space-y-4 p-5 rounded-2xl shadow-lg relative overflow-hidden",
            isAi ? "bg-chat-ai text-foreground" : "bg-chat-user text-foreground"
          )}
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <p className="text-body leading-relaxed whitespace-pre-wrap">
            {formattedMessage}
          </p>
          
          {isAi && (
            <motion.div 
              className="flex flex-col gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MessageActions onListen={onListen} shouldShowImageGen={shouldShowImageGen} />
              {shouldShowImageGen && <ImageGenerator prompt={message} />}
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