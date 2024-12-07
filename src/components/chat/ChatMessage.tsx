import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { RelatedBlocks } from "./RelatedBlocks";
import { MessageContent } from "./MessageContent";
import { LoaderCircle } from "lucide-react";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: (text: string) => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  imageUrl?: string;
  isTyping?: boolean;
}

export const ChatMessage = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick,
  onQuizGenerated,
  onPanelOpen,
  imageUrl,
  isTyping
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
        "w-full max-w-full mx-auto flex flex-col items-start gap-2",
        "px-3 sm:px-4 md:px-6",
        isAi ? "py-4 sm:py-6" : "py-3 sm:py-4"
      )}>
        {isAi && isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/80 text-sm px-2"
          >
            <LoaderCircle className="w-4 h-4 animate-spin" />
            <span>Wonderwhiz is typing...</span>
          </motion.div>
        )}

        <motion.div
          className={cn(
            "relative flex-1 w-full",
            isAi ? "text-white" : "text-app-text-dark"
          )}
          layout
        >
          <MessageContent 
            message={message} 
            isAi={isAi} 
            onListen={onListen}
            onQuizGenerated={onQuizGenerated}
            onPanelOpen={onPanelOpen}
            imageUrl={imageUrl}
          />
          
          {isAi && blocks && blocks.length > 0 && onBlockClick && (
            <motion.div 
              className="mt-4 relative z-10 w-full"
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