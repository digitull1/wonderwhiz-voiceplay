import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUpload } from "./ImageUpload";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleVoiceInput: (text: string) => void;
  isLoading: boolean;
  currentTopic: string;
  onImageAnalyzed: (response: string) => void;
}

export const ChatInput = ({
  input,
  setInput,
  handleSend,
  isLoading,
  currentTopic,
  onImageAnalyzed
}: ChatInputProps) => {
  return (
    <motion.div 
      className="flex flex-col gap-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex gap-2 relative">
        <AnimatePresence mode="wait">
          <motion.div className="flex-1 relative" key="input">
            <Input
              placeholder={isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="w-full bg-white/90 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl pl-12 pr-4 py-6 text-lg shadow-lg transition-all duration-200 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <motion.div 
              className="absolute left-4 top-1/2 -translate-y-1/2"
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary/60" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <Button 
          onClick={handleSend} 
          disabled={isLoading} 
          className="bg-primary hover:bg-primary/90 text-white px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Send className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ImageUpload onImageAnalyzed={onImageAnalyzed} />
      </motion.div>

      {/* Decorative gradient line */}
      <div className="absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-t from-white/50 to-transparent" />
    </motion.div>
  );
};