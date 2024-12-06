import React, { useState } from "react";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input for now
    setTimeout(() => {
      setIsListening(false);
      onVoiceInput("What is a black hole?");
    }, 2000);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="icon"
        className={`relative w-12 h-12 rounded-full ${
          isListening ? "bg-primary/10 border-primary" : ""
        }`}
        onClick={handleVoiceInput}
      >
        {isListening && (
          <>
            <span className="absolute -top-8 text-sm text-primary font-medium">
              Listening...
            </span>
            <span className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/30" />
          </>
        )}
        <Mic className={`w-5 h-5 ${isListening ? "text-primary" : ""}`} />
      </Button>
    </motion.div>
  );
};