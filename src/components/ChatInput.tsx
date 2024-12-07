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

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Oops!",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "🎙️ Listening...",
        description: "Speak clearly into your microphone",
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");

      setInput(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Oops!",
        description: "I didn't catch that. Want to try again?",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-2 relative px-2 pb-2 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-white/50">
          <ImageUpload 
            onImageAnalyzed={onImageAnalyzed}
            className={cn(
              "bg-gradient-to-r from-primary/80 to-primary/90 hover:from-primary hover:to-primary",
              "text-white p-2.5 rounded-xl transition-all duration-200",
              "shadow-sm hover:shadow-md active:scale-95",
              "flex items-center justify-center min-h-[40px] min-w-[40px]"
            )}
          >
            <ImagePlus className="w-5 h-5" />
          </ImageUpload>

          <Input
            placeholder={placeholder || (isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className={cn(
              "flex-1 bg-transparent border-0 shadow-none text-[15px]",
              "placeholder:text-primary/40 min-h-[40px] focus-visible:ring-0",
              "hover:bg-transparent focus:bg-transparent"
            )}
            disabled={isLoading}
          />

          <Button
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "bg-gradient-to-r min-h-[40px] min-w-[40px] p-2.5",
              isListening 
                ? "from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600" 
                : "from-secondary/90 to-secondary hover:from-secondary hover:to-secondary",
              "text-white rounded-xl shadow-sm hover:shadow-md",
              "transition-all duration-200 active:scale-95",
              "border border-white/20 backdrop-blur-sm"
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()} 
            className={cn(
              "bg-gradient-to-r from-primary/90 to-primary",
              "hover:from-primary hover:to-primary text-white",
              "min-h-[40px] min-w-[40px] p-2.5 rounded-xl",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
              "border border-white/20 backdrop-blur-sm"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};