import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Sparkles, ImagePlus, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    if (input.trim()) {
      handleSend();
      setInput("");
      setIsExpanded(false);
    }
  };

  return (
    <motion.div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2",
        "bg-gradient-to-t from-white/80 to-transparent backdrop-blur-xl",
        "transition-all duration-300 ease-out"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className={cn(
            "flex items-center gap-2 w-full rounded-full",
            "bg-white/80 backdrop-blur-xl p-1.5",
            "shadow-input border border-white/20",
            "transition-all duration-300 ease-out",
            isExpanded && "rounded-2xl"
          )}
          animate={{ 
            height: isExpanded ? (isMobile ? 100 : 120) : 56
          }}
        >
          <Button
            onClick={() => setIsListening(!isListening)}
            className={cn(
              "rounded-full w-10 h-10 p-0 relative overflow-hidden shrink-0",
              isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
            )}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-white" />
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
            onFocus={() => setIsExpanded(true)}
            onBlur={() => !input && setIsExpanded(false)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className={cn(
              "flex-1 bg-transparent border-0 shadow-none",
              "text-body placeholder:text-gray-400 focus-visible:ring-0",
              "transition-all duration-300",
              isExpanded ? "h-[80px]" : "h-10"
            )}
            style={{
              resize: isExpanded ? "vertical" : "none"
            }}
            disabled={isLoading}
          />

          <ImageUpload 
            onImageAnalyzed={onImageAnalyzed}
            className={cn(
              "rounded-full w-10 h-10 shrink-0",
              "bg-secondary hover:bg-secondary/90",
              "flex items-center justify-center transition-colors"
            )}
          >
            <ImagePlus className="w-4 h-4 text-white" />
          </ImageUpload>

          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()} 
            className="rounded-full w-10 h-10 bg-accent hover:bg-accent/90 p-0 shrink-0"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};