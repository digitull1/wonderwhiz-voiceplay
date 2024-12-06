import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Sparkles, ImagePlus } from "lucide-react";
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
  const handleSubmit = () => {
    if (input.trim()) {
      handleSend();
      setInput(""); // Clear input after sending
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex gap-3 items-end relative">
        <ImageUpload 
          onImageAnalyzed={onImageAnalyzed}
          className="bg-gradient-to-r from-primary via-purple-500 to-purple-600 hover:from-primary/90 
            hover:to-purple-600/90 text-white p-3 rounded-xl shadow-lg transition-all 
            duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 
            disabled:hover:scale-100 flex items-center justify-center"
        >
          <ImagePlus className="w-5 h-5" />
        </ImageUpload>

        <div className="flex-1 relative">
          <Input
            placeholder={isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm 
              border-2 border-primary/30 focus:border-primary/60 rounded-2xl pl-12 pr-4 py-6 
              text-lg shadow-lg transition-all duration-300 placeholder:text-primary/40 
              hover:shadow-xl hover:scale-[1.01] focus:scale-[1.01] focus:shadow-xl"
            disabled={isLoading}
          />
          <motion.div 
            className="absolute left-4 top-1/2 -translate-y-1/2"
            animate={{ 
              rotate: isLoading ? 360 : 0,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()} 
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 
            hover:to-purple-600/90 text-white px-6 py-6 rounded-xl shadow-lg transition-all 
            duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 
            disabled:hover:scale-100"
        >
          <Send className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
        </Button>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute -bottom-6 left-0 right-0 h-6 
        bg-gradient-to-t from-white/50 to-transparent" />
    </motion.div>
  );
};