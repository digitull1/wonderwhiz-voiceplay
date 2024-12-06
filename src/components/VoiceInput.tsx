import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onVoiceInput(text);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: "Oops!",
          description: "There was an error with the microphone. Please try again!",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceInput, toast]);

  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="icon"
        className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
          isListening 
            ? "bg-primary/10 border-primary shadow-lg ring-2 ring-primary/50" 
            : "hover:bg-primary/5"
        }`}
        onClick={handleVoiceInput}
      >
        <AnimatePresence>
          {isListening && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -32 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute whitespace-nowrap text-sm font-medium text-primary"
              >
                Listening... 🎤
              </motion.span>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-primary/30"
              />
            </>
          )}
        </AnimatePresence>
        <Mic className={`w-5 h-5 ${isListening ? "text-primary animate-pulse" : ""}`} />
      </Button>
    </motion.div>
  );
};