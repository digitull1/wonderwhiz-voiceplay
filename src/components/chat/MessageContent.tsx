import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { GeneratedImage } from "../image/GeneratedImage";
import { ImageAction } from "./actions/ImageAction";
import { QuizAction } from "./actions/QuizAction";
import { TrophyAction } from "./actions/TrophyAction";

interface MessageContentProps {
  message: string;
  isAi?: boolean;
  onListen?: (text: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  imageUrl?: string;
}

export const MessageContent = ({ 
  message, 
  isAi,
  onListen,
  onQuizGenerated,
  onPanelOpen,
  imageUrl
}: MessageContentProps) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    if (isAi && message) {
      setIsTyping(true);
      setDisplayedText("");
      
      let currentText = "";
      const words = message.split(" ");
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          currentText += (currentIndex > 0 ? " " : "") + words[currentIndex];
          setDisplayedText(currentText);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      setDisplayedText(message);
      setIsTyping(false);
    }
  }, [message, isAi]);

  return (
    <motion.div 
      className={cn(
        "relative p-3 sm:p-4 rounded-lg w-full",
        isAi ? "message-bubble-ai" : "message-bubble-user"
      )}
      layout
    >
      {isAi && isTyping && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-white/80 mb-2 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
          <span>Wonderwhiz is typing...</span>
        </motion.div>
      )}

      <div className="prose max-w-none">
        {displayedText}
      </div>

      {imageUrl && (
        <motion.div 
          className="mt-4 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GeneratedImage imageUrl={imageUrl} />
        </motion.div>
      )}
      
      {isAi && (
        <div className="flex items-center gap-2 mt-3">
          <ActionIcon
            icon={Volume2}
            tooltip="Listen to message"
            onClick={() => onListen?.(message)}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white"
          />
          <ImageAction messageText={message} />
          <QuizAction messageText={message} />
          <TrophyAction onPanelOpen={onPanelOpen} />
        </div>
      )}
    </motion.div>
  );
};