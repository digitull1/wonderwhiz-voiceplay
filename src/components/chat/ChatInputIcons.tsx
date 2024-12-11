import React from "react";
import { Send, Mic, Dice6, Camera, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ImageUpload } from "../ImageUpload";
import { motion } from "framer-motion";

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
    <TooltipProvider delayDuration={300}>
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
          <TooltipContent side="top" className="bg-primary text-white">
            <p>Send message</p>
          </TooltipContent>
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
          <TooltipContent side="top" className="bg-primary text-white">
            <p>Use your voice</p>
          </TooltipContent>
        </Tooltip>

        {onImageAnalyzed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <ImageUpload 
                  onImageAnalyzed={onImageAnalyzed}
                  className="z-10"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
                      "hover:bg-white hover:scale-110 active:scale-95",
                      "transition-all duration-300 relative overflow-hidden",
                      "after:content-[''] after:absolute after:inset-0",
                      "after:bg-gradient-to-r after:from-primary/20 after:to-secondary/20",
                      "after:opacity-0 after:hover:opacity-100 after:transition-opacity"
                    )}
                  >
                    <Camera className="w-4 h-4 relative z-10" />
                  </Button>
                </ImageUpload>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-primary text-white">
              <p>Share a picture</p>
            </TooltipContent>
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
          <TooltipContent side="top" className="bg-primary text-white">
            <p>Get a random question</p>
          </TooltipContent>
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
            <TooltipContent side="top" className="bg-primary text-white">
              <p>Generate a quiz</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};