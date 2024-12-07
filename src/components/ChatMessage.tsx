import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { MessageContent } from "./chat/MessageContent";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: (text: string) => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
}

export const ChatMessage = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick,
  onQuizGenerated,
  onPanelOpen
}: ChatMessageProps) => {
  return (
    <motion.div 
      className={cn(
        "flex w-full",
        isAi ? "bg-gradient-luxury" : "bg-white/5"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn(
        "w-full max-w-7xl mx-auto flex items-start gap-3 px-4 md:px-6",
        isAi ? "py-6" : "py-4"
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
            "relative flex-1",
            isAi ? "text-white" : "text-app-text-dark"
          )}
          layout
        >
          <MessageContent 
            message={message} 
            isAi={isAi} 
            onListen={() => onListen?.(message)}
            onQuizGenerated={onQuizGenerated}
            onPanelOpen={onPanelOpen}
          />
          
          {isAi && blocks && blocks.length > 0 && onBlockClick && (
            <motion.div 
              className="mt-4 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RelatedBlocks blocks={blocks} onBlockClick={onBlockClick} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};