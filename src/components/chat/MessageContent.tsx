import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Volume2, Image, BookOpen, Trophy } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";

interface MessageContentProps {
  message: string;
  isAi?: boolean;
  onListen?: () => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
}

export const MessageContent = ({ 
  message, 
  isAi,
  onListen,
  onQuizGenerated,
  onPanelOpen
}: MessageContentProps) => {
  return (
    <motion.div 
      className={cn(
        "relative p-4 rounded-lg",
        isAi ? "message-bubble-ai" : "message-bubble-user"
      )}
      layout
    >
      <div className="prose max-w-none">
        {message}
      </div>
      
      {isAi && (
        <div className="flex items-center gap-1.5 mt-3">
          <ActionIcon
            icon={Volume2}
            tooltip="Listen to message"
            onClick={() => onListen?.(message)}
            className="bg-gradient-to-br from-blue-500/5 to-purple-500/5"
          />
          <ActionIcon
            icon={Image}
            tooltip="Generate an image"
            onClick={() => {}} // Will be implemented in ImageAction component
            className="bg-gradient-to-br from-green-500/5 to-teal-500/5"
          />
          <ActionIcon
            icon={BookOpen}
            tooltip="Take a quiz"
            onClick={() => onQuizGenerated?.(message)}
            className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5"
          />
          <ActionIcon
            icon={Trophy}
            tooltip="View progress"
            onClick={onPanelOpen}
            className="bg-gradient-to-br from-purple-500/5 to-pink-500/5"
          />
        </div>
      )}
    </motion.div>
  );
};