import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatInputIcons } from "./chat/ChatInputIcons";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleVoiceInput: () => void;
  isLoading?: boolean;
  currentTopic?: string;
  onImageAnalyzed?: (response: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSend,
  isLoading,
  currentTopic,
  onImageAnalyzed,
  onQuizGenerated,
  placeholder = "Type a message..."
}) => {
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

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 p-4 md:p-6">
      <div className="max-w-screen-lg mx-auto flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={placeholder}
            className={cn(
              "w-full px-4 py-2 rounded-xl",
              "bg-white/50 backdrop-blur-sm border border-white/20",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "placeholder:text-gray-400"
            )}
            disabled={isLoading}
          />
        </div>

        <ChatInputIcons
          onSend={handleSend}
          onVoice={toggleListening}
          onRandom={generateRandomQuestion}
          onImageAnalyzed={onImageAnalyzed}
          onQuizGenerated={onQuizGenerated}
          isLoading={isLoading}
          disabled={!input.trim()}
        />
      </div>
    </div>
  );
};
