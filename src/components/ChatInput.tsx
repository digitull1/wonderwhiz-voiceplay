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
      className="flex flex-col gap-4 relative px-4 pb-safe-bottom w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 justify-center">
          <ImageUpload 
            onImageAnalyzed={onImageAnalyzed}
            className="bg-gradient-to-r from-[#4CABFF]/90 to-[#6DBDFF]/90 
              hover:from-[#4CABFF] hover:to-[#6DBDFF] text-white p-3 rounded-xl 
              shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 
              disabled:opacity-50 disabled:hover:scale-100 min-h-[48px] min-w-[48px]
              flex items-center justify-center border border-white/20 backdrop-blur-sm"
          >
            <ImagePlus className="w-5 h-5" />
          </ImageUpload>

          <Button
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "bg-gradient-to-r min-h-[48px] min-w-[48px]",
              isListening 
                ? "from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600" 
                : "from-[#6DBDFF]/90 to-[#4CABFF]/90 hover:from-[#6DBDFF] hover:to-[#4CABFF]",
              "text-white p-3 rounded-xl shadow-lg transition-all duration-300",
              "hover:scale-105 active:scale-95 relative border border-white/20 backdrop-blur-sm"
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>

        <div className="relative w-full">
          <Input
            placeholder={placeholder || (isLoading ? "Thinking..." : `Ask me anything about ${currentTopic}...`)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-gradient-to-r from-white/80 to-white/90 backdrop-blur-sm 
              border-2 border-primary/30 focus:border-primary/60 rounded-2xl pl-12 pr-4 py-6 
              text-[14px] md:text-[16px] shadow-lg transition-all duration-300 
              placeholder:text-primary/40 min-h-[48px]
              hover:shadow-xl hover:scale-[1.01] focus:scale-[1.01] focus:shadow-xl
              focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
          className="bg-gradient-to-r from-primary/90 to-secondary/90 
            hover:from-primary hover:to-secondary text-white px-6 py-6 rounded-xl 
            shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 
            disabled:opacity-50 disabled:hover:scale-100 min-h-[48px]
            border border-white/20 backdrop-blur-sm self-end"
        >
          <Send className={cn("w-5 h-5", isLoading && "animate-pulse")} />
        </Button>
      </div>

      <div className="absolute -bottom-6 left-0 right-0 h-6 
        bg-gradient-to-t from-white/50 to-transparent" />
    </motion.div>
  );
};