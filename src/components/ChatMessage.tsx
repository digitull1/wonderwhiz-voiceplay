import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block, QuizState } from "@/types/chat";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { MessageContent } from "./chat/MessageContent";
import { QuizCard } from "./quiz/QuizCard";

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
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
  messageIndex?: number;
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
  isTyping,
  quizState,
  onQuizAnswer,
  messageIndex = 0
}: ChatMessageProps) => {
  const [showBlocks, setShowBlocks] = React.useState(false);
  const showActions = !isAi || messageIndex > 3;

  React.useEffect(() => {
    if (!isTyping && isAi) {
      const timer = setTimeout(() => {
        setShowBlocks(true);
      }, 500); // Small delay after typing finishes
      return () => clearTimeout(timer);
    }
  }, [isTyping, isAi]);

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
            onListen={showActions ? onListen : undefined}
            onQuizGenerated={showActions ? onQuizGenerated : undefined}
            onPanelOpen={showActions ? onPanelOpen : undefined}
            imageUrl={imageUrl}
            showActions={showActions}
          />
          
          {isAi && blocks && blocks.length > 0 && onBlockClick && (
            <RelatedBlocks 
              blocks={blocks} 
              onBlockClick={onBlockClick} 
              show={showBlocks}
            />
          )}

          {isAi && quizState?.isActive && quizState.currentQuestion && onQuizAnswer && (
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
};