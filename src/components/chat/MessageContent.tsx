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
  const words = message.split(' ');
  const [displayedWords, setDisplayedWords] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isAi) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedWords(prev => [...prev, words[currentIndex]]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayedWords(words);
    }
  }, [message, isAi, words]);

  return (
    <motion.div 
      className={cn(
        "relative p-3 sm:p-4 rounded-lg w-full",
        isAi ? "message-bubble-ai" : "message-bubble-user"
      )}
      layout
    >
      <div className="prose max-w-none">
        {displayedWords.join(' ')}
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
          <QuizAction 
            messageText={message}
            onQuizGenerated={onQuizGenerated}
          />
          <TrophyAction onPanelOpen={onPanelOpen} />
        </div>
      )}
    </motion.div>
  );
};