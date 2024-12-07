import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MessageContentProps {
  message: string;
  isAi?: boolean;
  onListen?: () => void;
}

export const MessageContent = ({ message, isAi, onListen }: MessageContentProps) => {
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
      onListen();
    } else if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative flex-1">
      <p className={`text-[15px] leading-relaxed tracking-wide font-medium
        whitespace-pre-wrap relative z-10 ${isAi ? 'text-app-text-dark' : 'text-app-text-dark'}`}>
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
            active:scale-95 z-20 text-app-text-dark"
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
    </div>
  );
};