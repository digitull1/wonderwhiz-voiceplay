import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Volume2, Image, BookOpen, Trophy } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { GeneratedImage } from "../image/GeneratedImage";

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
  return (
    <motion.div 
      className={cn(
        "relative p-4 rounded-lg w-full",
        isAi ? "message-bubble-ai" : "message-bubble-user"
      )}
      layout
    >
      <div className="prose max-w-none">
        {message}
      </div>

      {imageUrl && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GeneratedImage imageUrl={imageUrl} />
        </motion.div>
      )}
      
      {isAi && (
        <div className="flex items-center gap-1.5 mt-3">
          <ActionIcon
            icon={Volume2}
            tooltip="Listen to message"
            onClick={() => onListen?.(message)}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white"
          />
          <ActionIcon
            icon={Image}
            tooltip="Generate an image"
            onClick={() => {}} // Will be implemented in ImageAction component
            className="bg-gradient-to-br from-green-500/20 to-teal-500/20 text-white"
          />
          <ActionIcon
            icon={BookOpen}
            tooltip="Take a quiz"
            onClick={() => onQuizGenerated?.(message)}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 text-white"
          />
          <ActionIcon
            icon={Trophy}
            tooltip="View progress"
            onClick={onPanelOpen}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white"
          />
        </div>
      )}
    </motion.div>
  );
};