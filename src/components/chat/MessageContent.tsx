import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageActions } from "./actions/MessageActions";

interface MessageContentProps {
  message: string;
  isAi?: boolean;
  onListen?: (text: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  imageUrl?: string;
  showActions?: boolean;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  onImageAnalyzed?: (response: string) => void;
}

export const MessageContent: React.FC<MessageContentProps> = ({ 
  message, 
  isAi,
  onListen,
  onQuizGenerated,
  onPanelOpen,
  imageUrl,
  showActions = true,
  isTyping,
  onTypingComplete,
  onImageAnalyzed
}) => {
  const [displayedText, setDisplayedText] = useState(message);

  useEffect(() => {
    setDisplayedText(message);
    if (!isTyping) {
      onTypingComplete?.();
    }
  }, [message, isTyping, onTypingComplete]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div 
          className={cn(
            "prose max-w-none whitespace-pre-line",
            isAi ? "text-white" : "text-app-text-dark",
            "relative z-10"
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {/* Decorative Background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg -z-10"
            animate={{ 
              opacity: [0.3, 0.1, 0.3],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {displayedText}

          {imageUrl && (
            <motion.div
              className="mt-4 relative overflow-hidden rounded-xl shadow-luxury"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay"
                animate={{ 
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <img
                src={imageUrl}
                alt="Generated content"
                className="relative z-10 w-full max-w-md mx-auto rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-[1.02]"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {isAi && showActions && !isTyping && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <MessageActions 
            onQuizGenerated={onQuizGenerated}
            messageText={message}
            onPanelOpen={onPanelOpen}
            onImageAnalyzed={onImageAnalyzed}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MessageContent;