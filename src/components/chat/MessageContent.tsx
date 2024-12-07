import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageActions } from "./MessageActions";

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
  onTypingComplete
}) => {
  const [displayedText, setDisplayedText] = useState("");
  console.log("MessageContent rendered:", { isTyping, message, showActions });

  const animateText = useCallback(() => {
    if (isAi && message && !isTyping) {
      console.log("Starting text animation");
      setDisplayedText("");
      let currentText = "";
      const lines = message.split("\n");
      let currentLineIndex = 0;
      let currentCharIndex = 0;
      let isCompleting = false;

      const interval = setInterval(() => {
        if (isCompleting) return;

        if (currentLineIndex < lines.length) {
          const currentLine = lines[currentLineIndex];
          
          if (currentCharIndex < currentLine.length) {
            currentText += currentLine[currentCharIndex];
            currentCharIndex++;
          } else {
            currentText += "\n";
            currentLineIndex++;
            currentCharIndex = 0;
          }
          
          setDisplayedText(currentText);

          if (currentLineIndex >= lines.length) {
            isCompleting = true;
            clearInterval(interval);
            console.log("Text animation complete");
            setTimeout(() => {
              console.log("Calling onTypingComplete");
              onTypingComplete?.();
            }, 800);
          }
        }
      }, 35);

      return () => {
        clearInterval(interval);
      };
    } else {
      setDisplayedText(message);
      onTypingComplete?.();
    }
  }, [message, isAi, onTypingComplete, isTyping]);

  useEffect(() => {
    console.log("Effect triggered, starting animation");
    const cleanup = animateText();
    return () => cleanup?.();
  }, [animateText]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div 
          className={cn(
            "prose max-w-none whitespace-pre-line",
            isAi ? "text-white" : "text-app-text-dark"
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {displayedText}
          {imageUrl && (
            <motion.img
              src={imageUrl}
              alt="Generated content"
              className="mt-4 rounded-lg w-full max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showActions && !isTyping && (
        <MessageActions 
          onListen={onListen}
          onQuizGenerated={onQuizGenerated}
          messageText={message}
          onPanelOpen={onPanelOpen}
        />
      )}
    </div>
  );
};

export default MessageContent;