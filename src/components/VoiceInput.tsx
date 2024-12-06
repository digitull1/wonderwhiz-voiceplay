import React, { useState } from "react";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";

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
    <Button
      variant="outline"
      size="icon"
      className={`relative ${isListening ? "animate-pulse" : ""}`}
      onClick={handleVoiceInput}
    >
      {isListening && (
        <span className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/50" />
      )}
      <Mic className={`w-4 h-4 ${isListening ? "text-primary" : ""}`} />
    </Button>
  );
};