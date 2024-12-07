import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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

const MessageContent = ({ 
  message, 
  isAi,
  onListen,
  onQuizGenerated,
  onPanelOpen,
  imageUrl,
  showActions = true,
  isTyping,
  onTypingComplete
}: MessageContentProps) => {
  const [displayedText, setDisplayedText] = useState("");
  console.log("MessageContent rendered:", { isTyping, message, showActions });

  const animateText = useCallback(() => {
    if (isAi && message && !isTyping) {
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
            setTimeout(() => {
              console.log("Typing animation complete");
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
    const cleanup = animateText();
    return () => cleanup?.();
  }, [animateText]);

  return (
    <div className="relative">
      <div className={cn(
        "prose max-w-none whitespace-pre-line",
        isAi ? "text-white" : "text-app-text-dark"
      )}>
        {displayedText}
      </div>

      {showActions && !isTyping && (
        <MessageActions 
          onListen={onListen}
          onQuizGenerated={onQuizGenerated}
          messageText={message}
        />
      )}
    </div>
  );
};

export default React.memo(MessageContent);