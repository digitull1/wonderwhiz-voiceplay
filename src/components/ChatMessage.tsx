import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { Volume2, VolumeX } from "lucide-react";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: (text: string) => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
}

export const ChatMessage = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick 
}: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(!isAi);
  
  useEffect(() => {
    if (isAi) {
      const cleanedMessage = message?.replace(/undefined|null/g, '').trim() || 
        "Hi! I'm WonderWhiz! What's your name? 😊";
      const messageWords = cleanedMessage.split(' ');
      setWords(messageWords);
      setCurrentWordIndex(0);
      setIsTypingComplete(false);

      const typingInterval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= messageWords.length - 1) {
            clearInterval(typingInterval);
            setIsTypingComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Adjust speed here

      return () => clearInterval(typingInterval);
    } else {
      setWords(message ? message.split(' ') : []);
      setCurrentWordIndex(message ? message.split(' ').length - 1 : 0);
      setIsTypingComplete(true);
    }
  }, [message, isAi]);

  const handleListen = () => {
    if (onListen && !isPlaying) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div 
      className={cn(
        "flex mb-4 px-4",
        isAi ? "justify-start" : "justify-end"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 25
      }}
    >
      <div className={cn(
        "flex items-start gap-3 max-w-[85%] group",
        isAi ? "w-full" : "w-full"
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
            "relative p-4 rounded-2xl shadow-luxury backdrop-blur-xl",
            isAi ? 
              "message-bubble-ai rounded-tl-sm bg-chat-ai" : 
              "message-bubble-user rounded-tr-sm"
          )}
          layout
        >
          <p className="text-[15px] leading-relaxed tracking-wide font-medium
            text-gray-800 whitespace-pre-wrap relative z-10">
            {words.slice(0, currentWordIndex + 1).join(' ')}
            {isAi && !isTypingComplete && (
              <motion.span
                className="inline-block w-1.5 h-4 bg-primary ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
          
          {isAi && (
            <motion.button
              onClick={handleListen}
              className="absolute top-3 right-3 opacity-70 hover:opacity-100 
                cursor-pointer transition-all p-1.5 rounded-full hover:bg-white/50
                active:scale-95 z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </motion.button>
          )}
          
          <AnimatePresence>
            {isAi && blocks && blocks.length > 0 && onBlockClick && isTypingComplete && (
              <motion.div 
                className="mt-4 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RelatedBlocks blocks={blocks} onBlockClick={onBlockClick} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};