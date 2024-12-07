import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block, QuizState } from "@/types/chat";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { MessageContent } from "./chat/MessageContent";
import { QuizCard } from "./quiz/QuizCard";
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
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
  messageIndex?: number;
}

export const ChatMessage = React.memo(({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick,
  onQuizGenerated,
  onPanelOpen,
  imageUrl,
  quizState,
  onQuizAnswer,
  messageIndex = 0
}: ChatMessageProps) => {
  const [isTyping, setIsTyping] = useState(true);
  const [showBlocks, setShowBlocks] = useState(false);
  const showActions = !isAi || messageIndex > 3;

  // Reset typing state when message changes
  useEffect(() => {
    if (isAi) {
      setIsTyping(true);
      setShowBlocks(false);
    }
  }, [message, isAi]);

  // Handle typing completion
  const handleTypingComplete = () => {
    console.log("Typing complete, preparing to show blocks");
    setIsTyping(false);
    // Add longer delay before showing blocks
    setTimeout(() => {
      console.log("Showing blocks now");
      setShowBlocks(true);
    }, 1500);
  };

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
            className="flex items-center gap-2 text-primary font-medium px-2"
          >
            <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
            <span>Wonderwhiz is typing...</span>
          </motion.div>
        )}

        <motion.div
          className={cn(
            "relative flex-1 w-full group",
            isAi ? "message-bubble-ai" : "message-bubble-user",
            "rounded-xl p-4 sm:p-6"
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
            showActions={showActions && !isTyping}
            isTyping={isTyping}
            onTypingComplete={handleTypingComplete}
          />
          
          {isAi && blocks && blocks.length > 0 && onBlockClick && showBlocks && !isTyping && (
            <RelatedBlocks 
              blocks={blocks} 
              onBlockClick={onBlockClick} 
              show={showBlocks}
            />
          )}

          {isAi && quizState?.isActive && quizState.currentQuestion && onQuizAnswer && !isTyping && (
            <motion.div 
              className="mt-4 relative z-10 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuizCard
                question={quizState.currentQuestion}
                onAnswer={onQuizAnswer}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";