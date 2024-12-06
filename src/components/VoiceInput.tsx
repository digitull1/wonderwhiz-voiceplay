import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        setRecognition(recognition);
      }
    }
  }, []);

  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join("");

    if (event.results[0].isFinal) {
      onVoiceInput(transcript);
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    }
  }, [onVoiceInput, recognition]);

  const handleError = useCallback((event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error:", event.error);
    toast({
      title: "Oops!",
      description: "There was an error with voice recognition. Please try again.",
      variant: "destructive",
    });
    setIsListening(false);
  }, [toast]);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
      recognition.onerror = handleError;
    }
  }, [recognition, handleResult, handleError]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        className={`relative ${
          isListening ? "bg-primary text-white" : "hover:bg-primary/10"
        }`}
        onClick={toggleListening}
      >
        {isListening ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <MicOff className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Mic className="h-4 w-4" />
          </motion.div>
        )}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
};