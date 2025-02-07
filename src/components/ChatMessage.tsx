import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block, QuizState } from "@/types/chat";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import MessageContent from "./chat/MessageContent";
import { QuizCard } from "./quiz/QuizCard";
import { LoaderCircle, Sparkles } from "lucide-react";
import { RewardAnimation } from "./rewards/RewardAnimation";
import { LoadingSparkles } from './LoadingSparkles';

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
  onImageAnalyzed?: (response: string) => void;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
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
  messageIndex = 0,
  onImageAnalyzed,
  isLoading
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const showActions = !isAi || messageIndex > 3;

  useEffect(() => {
    if (isAi && message) {
      setIsTyping(true);
      setShowBlocks(false);
      
      setIsTyping(false);
      setTimeout(() => {
        setShowBlocks(true);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 2000);
      }, 500);
    }
  }, [message, isAi]);

  const handleTypingComplete = () => {
    setIsTyping(false);
    setTimeout(() => {
      setShowBlocks(true);
    }, 500);
  };

  return (
    <>
      {showReward && <RewardAnimation type="points" points={5} />}
      
      <motion.div 
        className={cn(
          "flex w-full",
          isAi ? "bg-gradient-luxury" : "bg-white/5",
          "relative overflow-hidden"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        {/* Decorative Background Elements */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.3, 0.5] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className={cn(
          "w-full max-w-full mx-auto flex flex-col items-start gap-2",
          "px-0 sm:px-4 md:px-6", // Remove padding on mobile
          isAi ? "py-4 sm:py-6" : "py-3 sm:py-4",
          "relative"
        )}>
          {isAi && isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-primary font-medium px-2"
            >
              <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-display">Wonderwhiz is typing...</span>
            </motion.div>
          )}

          <motion.div
            className={cn(
              "relative flex-1 w-full group backdrop-blur-sm",
              isAi ? "message-bubble-ai" : "message-bubble-user",
              "sm:rounded-2xl p-4 sm:p-6", // Remove border radius on mobile
              "transition-all duration-300 ease-in-out",
              "hover:shadow-xl hover:scale-[1.01]",
              isAi ? "bg-gradient-to-br from-primary/95 to-secondary/95" : "bg-gradient-card",
              "border-y sm:border border-white/20" // Only show top/bottom borders on mobile
            )}
            layout
          >
            {/* Sparkle Effects */}
            <motion.div 
              className="absolute -top-2 -right-2"
              animate={{ 
                rotate: [0, 180, 360],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-4 h-4 text-white/40" />
            </motion.div>

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
                onTypingComplete={handleTypingComplete}
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
        </div>
      </motion.div>
    </>
  );
};

export default React.memo(ChatMessage);