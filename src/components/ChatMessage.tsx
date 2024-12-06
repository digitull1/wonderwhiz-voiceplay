import React from "react";
import { Button } from "./ui/button";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isAi, message, onListen }) => {
  return (
    <motion.div 
      className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isAi && (
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mr-3 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <span className="text-white text-lg">✨</span>
        </motion.div>
      )}
      <motion.div
        className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
          isAi
            ? "bg-gradient-to-br from-primary/90 to-purple-600/90 text-white"
            : "bg-gradient-to-br from-secondary/90 to-green-600/90 text-white"
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <p className="text-sm md:text-base leading-relaxed">{message}</p>
        {isAi && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-white hover:text-white/80 hover:bg-white/10"
            onClick={onListen}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};