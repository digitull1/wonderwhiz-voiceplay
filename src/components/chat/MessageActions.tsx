import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, BookOpen, ImageIcon, Trophy } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageAction } from "./actions/ImageAction";

interface MessageActionsProps {
  onListen?: (text: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  messageText: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  onListen, 
  onQuizGenerated,
  onPanelOpen,
  messageText
}) => {
  console.log("MessageActions rendered:", { hasListenHandler: !!onListen });

  return (
    <motion.div 
      className="post-chat-actions"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <AnimatePresence mode="wait">
        {onListen && (
          <ActionIcon
            icon={Volume2}
            tooltip="Listen to this message!"
            onClick={() => onListen(messageText)}
            className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
          />
        )}

        <ImageAction messageText={messageText} />

        {onQuizGenerated && (
          <QuizAction
            onQuizGenerated={onQuizGenerated}
            messageText={messageText}
            icon={BookOpen}
            tooltip="Let's have a fun quiz to test what you've learned!"
          />
        )}

        {onPanelOpen && (
          <ActionIcon
            icon={Trophy}
            tooltip="Check your progress!"
            onClick={onPanelOpen}
            className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};