import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initializing speech recognition...");
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.error('Not in browser environment');
      return;
    }

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log('SpeechRecognition available:', !!SpeechRecognition);

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating new SpeechRecognition instance...');
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      // Event handlers
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started successfully');
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
          className: "bg-primary text-white",
        });
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionInstance.onresult = (event) => {
        console.log('Speech recognition result received:', event.results);
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        console.log('Final transcript:', transcript);
        
        if (event.results[0].isFinal) {
          console.log('Sending final transcript to handler');
          onVoiceInput(transcript);
          recognitionInstance.stop();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'An error occurred with speech recognition.';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone was found. Ensure it is plugged in and allowed.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission was denied. Please allow access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsListening(false);
      };

      console.log('Setting recognition instance...');
      setRecognition(recognitionInstance);

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to initialize speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  }, [onVoiceInput, toast]);

  const toggleListening = () => {
    console.log('Toggle listening clicked, current state:', isListening);
    
    if (!recognition) {
      console.error('Recognition not initialized');
      toast({
        title: "Not Available",
        description: "Speech recognition is not available. Please try reloading the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isListening) {
        console.log('Stopping recognition...');
        recognition.stop();
      } else {
        console.log('Starting recognition...');
        recognition.start();
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to toggle speech recognition. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "relative rounded-full transition-all duration-300",
          isListening ? "bg-primary text-white" : "bg-white/80 hover:bg-primary/10"
        )}
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