import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { VoiceInput } from "./VoiceInput";
import { motion } from "framer-motion";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleVoiceInput: (text: string) => void;
  isLoading: boolean;
  currentTopic: string;
}

export const ChatInput = ({
  input,
  setInput,
  handleSend,
  handleVoiceInput,
  isLoading,
  currentTopic,
}: ChatInputProps) => {
  return (
    <motion.div 
      className="flex gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Input
        placeholder={isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 bg-white/80 backdrop-blur-sm"
        disabled={isLoading}
      />
      <VoiceInput onVoiceInput={handleVoiceInput} />
      <Button 
        onClick={handleSend} 
        disabled={isLoading} 
        className="bg-primary hover:bg-primary/90 text-white"
      >
        <Send className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
      </Button>
    </motion.div>
  );
};