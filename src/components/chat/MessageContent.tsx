import React, { useState, useEffect } from "react";
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

export const MessageContent = ({ 
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

  useEffect(() => {
    if (isAi && message) {
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
          console.log("Typing animation:", { currentText, isComplete: currentLineIndex >= lines.length });

          // Check if typing is complete
          if (currentLineIndex >= lines.length) {
            isCompleting = true;
            clearInterval(interval);
            // Add a delay before marking as complete
            setTimeout(() => {
              console.log("Typing animation complete");
              onTypingComplete?.();
            }, 800);
          }
        }
      }, 35); // Slightly slower typing speed for better readability

      return () => {
        clearInterval(interval);
      };
    } else {
      setDisplayedText(message);
      onTypingComplete?.();
    }
  }, [message, isAi, onTypingComplete]);

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