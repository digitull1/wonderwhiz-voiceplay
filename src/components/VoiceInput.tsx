import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Waveform } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [volume, setVolume] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') {
      console.error('Not in browser environment');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      // Configure audio analysis for visualization
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      recognitionInstance.onstart = async () => {
        console.log('Speech recognition started');
        setIsListening(true);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          
          const updateVolume = () => {
            if (isListening) {
              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              setVolume(average / 128.0); // Normalize to 0-1
              requestAnimationFrame(updateVolume);
            }
          };
          updateVolume();
        } catch (error) {
          console.error('Error accessing microphone:', error);
        }

        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
          className: "bg-primary text-white",
        });
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setVolume(0);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (event.results[0].isFinal) {
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
    if (!recognition) {
      toast({
        title: "Not Available",
        description: "Speech recognition is not available. Please try reloading the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
      } else {
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
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "relative rounded-full transition-all duration-300",
          isListening ? "bg-primary text-white" : "bg-white/80 hover:bg-primary/10"
        )}
        onClick={toggleListening}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <MicOff className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="not-listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>

        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-primary/30"
              style={{
                scale: volume,
                opacity: volume
              }}
            />
          </>
        )}
      </Button>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-primary/80"
        >
          Listening...
        </motion.div>
      )}
    </motion.div>
  );
};