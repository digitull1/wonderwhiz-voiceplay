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
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          console.log("Speech recognition supported");
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            toast({
              title: "Listening...",
              description: "Speak clearly into your microphone",
              className: "bg-primary text-white",
            });
          };

          recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };

          recognition.onresult = (event) => {
            console.log('Speech recognition result received');
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');

            console.log('Transcript:', transcript);
            if (event.results[0].isFinal) {
              onVoiceInput(transcript);
              recognition.stop();
            }
          };

          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            toast({
              title: "Error",
              description: `Speech recognition error: ${event.error}`,
              variant: "destructive",
            });
            setIsListening(false);
          };

          setRecognition(recognition);
        } else {
          console.error('Speech Recognition not supported');
          toast({
            title: "Not Supported",
            description: "Speech recognition is not supported in your browser.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Speech recognition initialization error:', error);
        toast({
          title: "Error",
          description: "Failed to initialize speech recognition",
          variant: "destructive",
        });
      }
    }
  }, [onVoiceInput, toast]);

  const toggleListening = () => {
    console.log('Toggle listening clicked, current state:', isListening);
    if (!recognition) {
      console.error('Recognition not initialized');
      toast({
        title: "Not Available",
        description: "Speech recognition is not available",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      console.log('Stopping recognition');
      recognition.stop();
    } else {
      console.log('Starting recognition');
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
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