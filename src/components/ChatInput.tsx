import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Send, Upload, Dice6, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleVoiceInput: () => void;
  isLoading?: boolean;
  currentTopic?: string;
  onImageAnalyzed?: (response: string) => void;
  placeholder?: string;
}

export const ChatInput = ({
  input,
  setInput,
  handleSend,
  isLoading,
  currentTopic,
  onImageAnalyzed,
  placeholder = "Type a message..."
}: ChatInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognition = useRef<any>(null);

  const generateRandomQuestion = async () => {
    try {
      const { data: profileData } = await supabase.auth.getUser();
      if (!profileData?.user?.id) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', profileData.user.id)
        .single();

      const age = userProfile?.age || 8;

      const { data, error } = await supabase.functions.invoke('generate-random-question', {
        body: { age }
      });

      if (error) throw error;

      if (data?.question) {
        setInput(data.question);
        toast({
          title: "✨ Here's something interesting!",
          description: "Click send to explore this topic!",
          className: "bg-primary text-white"
        });
      }
    } catch (error) {
      console.error('Error generating random question:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate a question right now. Try again!",
        variant: "destructive"
      });
    }
  };

  const startListening = () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
        return;
      }

      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
          className: "bg-primary text-white"
        });
      };

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        console.log('Transcript:', transcript);
        setInput(transcript);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive"
        });
      };

      recognition.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-xl" />
        
        {/* Main input container */}
        <div className="relative px-4 py-4 md:py-6 max-w-screen-lg mx-auto">
          <div className="flex items-center gap-2">
            {onImageAnalyzed && (
              <ImageUpload onImageAnalyzed={onImageAnalyzed}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "relative bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                      "hover:bg-white hover:scale-110 active:scale-95",
                      "transition-all duration-300"
                    )}
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </ImageUpload>
            )}
            
            <div className="flex-1 relative group">
              <motion.div
                initial={false}
                animate={{ scale: input ? 0.98 : 1 }}
                className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                )}
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={placeholder}
                className={cn(
                  "w-full px-4 py-3 rounded-xl",
                  "bg-white/50 backdrop-blur-sm border border-white/20",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "placeholder:text-gray-400 text-base",
                  "transition-all duration-300",
                  "shadow-luxury hover:shadow-xl"
                )}
                disabled={isLoading}
              />
              {input && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-4 h-4 text-primary/40" />
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  onClick={generateRandomQuestion}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                    "hover:bg-white hover:scale-110 active:scale-95",
                    "transition-all duration-300"
                  )}
                >
                  <Dice6 className="w-4 h-4 text-primary" />
                </Button>

                <Button
                  onClick={toggleListening}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                    "hover:bg-white hover:scale-110 active:scale-95",
                    "transition-all duration-300",
                    isListening && "bg-red-500 hover:bg-red-600 text-white"
                  )}
                >
                  <Mic className="w-4 h-4" />
                  {isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500/20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </Button>

                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                    "hover:bg-white hover:scale-110 active:scale-95",
                    "transition-all duration-300",
                    "relative overflow-hidden"
                  )}
                >
                  <Send className="w-4 h-4 text-primary" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
                    animate={{ 
                      x: ['-100%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};