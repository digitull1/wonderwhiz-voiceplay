import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block, QuizState } from "@/types/chat";
import { RelatedBlocks } from "./RelatedBlocks";
import MessageContent from "./MessageContent";
import { QuizCard } from "../quiz/QuizCard";
import { LoadingSparkles } from '../LoadingSparkles';

interface MessageBodyProps {
  isAi: boolean;
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
  onImageAnalyzed?: (response: string) => void;
  isLoading?: boolean;
  isTyping: boolean;
  showBlocks: boolean;
  showActions: boolean;
  onTypingComplete: () => void;
}

export const MessageBody: React.FC<MessageBodyProps> = ({
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
  messageIndex,
  onImageAnalyzed,
  isLoading,
  isTyping,
  showBlocks,
  showActions,
  onTypingComplete
}) => {
  return (
    <motion.div
      className={cn(
        "relative flex-1 w-full group",
        isAi ? "message-bubble-ai" : "message-bubble-user",
        "rounded-xl p-4 sm:p-6"
      )}
      layout
    >
      {isLoading ? (
        <LoadingSparkles />
      ) : (
        <MessageContent 
          message={message} 
          isAi={isAi} 
          onListen={onListen}
          onQuizGenerated={onQuizGenerated}
          onPanelOpen={onPanelOpen}
          imageUrl={imageUrl}
          showActions={showActions && !isTyping}
          isTyping={isTyping}
          onTypingComplete={onTypingComplete}
          onImageAnalyzed={onImageAnalyzed}
        />
      )}
      
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
            questions={quizState.currentQuestion}
            onAnswer={onQuizAnswer}
          />
        </motion.div>
      )}
    </motion.div>
  );
};