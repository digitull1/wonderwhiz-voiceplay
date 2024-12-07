import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Sparkles, ImagePlus, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleVoiceInput: (text: string) => void;
  isLoading: boolean;
  currentTopic: string;
  onImageAnalyzed: (response: string) => void;
  placeholder?: string;
}

export const ChatInput = ({
  input,
  setInput,
  handleSend,
  isLoading,
  currentTopic,
  onImageAnalyzed,
  placeholder
}: ChatInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (input.trim()) {
      handleSend();
      setInput("");
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-2 relative px-4 pb-4 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 w-full bg-white/80 backdrop-blur-xl 
        rounded-full p-1.5 shadow-input border border-white/20">
        <Button
          onClick={() => setIsListening(!isListening)}
          className={cn(
            "rounded-full w-12 h-12 p-0 relative overflow-hidden",
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
          {isListening && (
            <motion.div
              className="absolute inset-0 bg-red-400 opacity-30"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Button>

        <Input
          placeholder={placeholder || (isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-transparent border-0 shadow-none text-body
            placeholder:text-gray-400 focus-visible:ring-0"
          disabled={isLoading}
        />

        <ImageUpload 
          onImageAnalyzed={onImageAnalyzed}
          className="rounded-full w-12 h-12 bg-secondary hover:bg-secondary/90
            flex items-center justify-center transition-colors"
        >
          <ImagePlus className="w-5 h-5 text-white" />
        </ImageUpload>

        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()} 
          className="rounded-full w-12 h-12 bg-accent hover:bg-accent/90 p-0"
        >
          {isLoading ? (
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};