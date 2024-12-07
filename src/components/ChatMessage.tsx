import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Block } from "@/types/chat";
import { ChatAvatar } from "./chat/ChatAvatar";
import { RelatedBlocks } from "./chat/RelatedBlocks";
import { Volume2, VolumeX, Image, BookOpen, Star, Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
      }, 50);

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

  const PostChatActions = () => (
    <motion.div 
      className="post-chat-actions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button 
              className="action-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-5 h-5 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a picture for this!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button 
              className="action-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Test your knowledge!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button 
              className="action-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-5 h-5 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You've earned points for learning!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button 
              className="action-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Level up your adventures!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );

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
        "w-full max-w-7xl mx-auto flex items-start gap-3 px-4 md:px-6",
        isAi ? "py-6" : "py-4"
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
            "relative flex-1",
            isAi ? "text-white" : "text-app-text-dark"
          )}
          layout
        >
          <p className="text-[15px] leading-relaxed tracking-wide font-medium
            whitespace-pre-wrap relative z-10">
            {words.slice(0, currentWordIndex + 1).join(' ')}
            {isAi && !isTypingComplete && (
              <motion.span
                className="inline-block w-1.5 h-4 bg-current ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
          
          {isAi && (
            <motion.button
              onClick={handleListen}
              className="absolute top-0 right-0 opacity-70 hover:opacity-100 
                cursor-pointer transition-all p-1.5 rounded-full hover:bg-white/20
                active:scale-95 z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <VolumeX className="w-4 h-4 text-current" />
              ) : (
                <Volume2 className="w-4 h-4 text-current" />
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

          {isAi && isTypingComplete && <PostChatActions />}
        </motion.div>
      </div>
    </motion.div>
  );
};