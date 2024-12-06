import React from "react";
import { Button } from "../ui/button";
import { Volume2, Image } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MessageActionsProps {
  onListen?: () => void;
  shouldShowImageGen: boolean;
  messageText: string;
}

export const MessageActions = ({ onListen, shouldShowImageGen, messageText }: MessageActionsProps) => {
  const { toast } = useToast();
  
  const handleListen = () => {
    if (!messageText) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(messageText);
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.1; // Slightly higher pitch for a kid-friendly voice
      
      // Handle errors
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        toast({
          title: "Oops!",
          description: "I couldn't read that message. Please try again!",
          variant: "destructive",
        });
      };
      
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Start new speech
      window.speechSynthesis.speak(utterance);
      
      if (onListen) {
        onListen();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Oops!",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {messageText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 group"
                onClick={handleListen}
              >
                <Volume2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Listen
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Listen to WonderWhiz read this message!</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {shouldShowImageGen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary hover:text-secondary/80 hover:bg-secondary/10 group"
              >
                <Image className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Generate Picture
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a magical picture about this topic!</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};