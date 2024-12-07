import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Upload } from "lucide-react";
import { ImageAction } from "./ImageAction";
import { ImageUpload } from "../../ImageUpload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  onPanelOpen?: () => void;
  messageText: string;
  onImageAnalyzed?: (response: string) => void;
  onQuizGenerated?: (quiz: any) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  onPanelOpen,
  messageText,
  onImageAnalyzed,
  onQuizGenerated
}) => {
  console.log("MessageActions rendered with props:", { 
    hasImageHandler: !!onImageAnalyzed,
    hasQuizHandler: !!onQuizGenerated
  });

  return (
    <motion.div 
      className="post-chat-actions"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <AnimatePresence mode="wait">
        {/* Image Generation Icon */}
        <ImageAction key="image" messageText={messageText} />

        {/* Image Upload Icon */}
        {onImageAnalyzed && (
          <ImageUpload onImageAnalyzed={onImageAnalyzed}>
            <Button
              key="upload"
              size="icon"
              variant="ghost"
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                "hover:bg-white hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "bg-gradient-to-br from-primary/20 to-accent/20"
              )}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </ImageUpload>
        )}

        {/* Trophy Icon */}
        {onPanelOpen && (
          <Button
            key="trophy"
            size="icon"
            variant="ghost"
            onClick={onPanelOpen}
            className={cn(
              "relative p-2 rounded-full transition-all duration-300",
              "hover:bg-white hover:scale-110 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "bg-gradient-to-br from-accent/20 to-secondary/20"
            )}
          >
            <Trophy className="w-4 h-4" />
          </Button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};