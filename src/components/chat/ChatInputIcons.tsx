import React from "react";
import { Send, Mic, Dice6, Camera, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ImageUpload } from "../ImageUpload";

interface ChatInputIconsProps {
  onSend: () => void;
  onVoice: () => void;
  onRandom: () => void;
  onImageAnalyzed?: (response: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInputIcons: React.FC<ChatInputIconsProps> = ({
  onSend,
  onVoice,
  onRandom,
  onImageAnalyzed,
  onQuizGenerated,
  isLoading,
  disabled
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSend}
              disabled={disabled || isLoading}
              variant="ghost"
              size="icon"
              className={cn(
                "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                "hover:bg-white hover:scale-110 active:scale-95",
                "transition-all duration-300"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onVoice}
              variant="ghost"
              size="icon"
              className={cn(
                "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                "hover:bg-white hover:scale-110 active:scale-95",
                "transition-all duration-300"
              )}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Use your voice</TooltipContent>
        </Tooltip>

        {onImageAnalyzed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <ImageUpload onImageAnalyzed={onImageAnalyzed}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                    "hover:bg-white hover:scale-110 active:scale-95",
                    "transition-all duration-300",
                    "relative overflow-hidden"
                  )}
                >
                  <Camera className="w-4 h-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </ImageUpload>
            </TooltipTrigger>
            <TooltipContent>Share a picture</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onRandom}
              variant="ghost"
              size="icon"
              className={cn(
                "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                "hover:bg-white hover:scale-110 active:scale-95",
                "transition-all duration-300"
              )}
            >
              <Dice6 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Get a random question</TooltipContent>
        </Tooltip>

        {onQuizGenerated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onQuizGenerated(null)}
                variant="ghost"
                size="icon"
                className={cn(
                  "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                  "hover:bg-white hover:scale-110 active:scale-95",
                  "transition-all duration-300",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a quiz</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};