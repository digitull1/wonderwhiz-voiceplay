import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageActions } from "./MessageActions";
import { PostChatActions } from "./PostChatActions";

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
      
      <div className="flex items-center justify-end gap-2 mt-2">
        {isAi && (
          <>
            <MessageActions onListen={onListen} messageText={message} />
            <PostChatActions 
              messageText={message} 
              onPanelOpen={onPanelOpen}
              onQuizGenerated={onQuizGenerated}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};