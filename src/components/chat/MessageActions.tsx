import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, BookOpen, ImageIcon, Trophy, Upload } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageAction } from "./actions/ImageAction";
import { ImageUpload } from "../ImageUpload";

interface MessageActionsProps {
  onListen?: (text: string) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  messageText: string;
  onImageAnalyzed?: (response: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  onListen, 
  onQuizGenerated,
  onPanelOpen,
  messageText,
  onImageAnalyzed
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
            key="listen"
            icon={Volume2}
            tooltip="Listen to this message!"
            onClick={() => onListen(messageText)}
            className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:scale-110"
          />
        )}

        <ImageAction key="image" messageText={messageText} />

        {onQuizGenerated && (
          <QuizAction
            key="quiz"
            onQuizGenerated={onQuizGenerated}
            messageText={messageText}
            icon={BookOpen}
            tooltip="Let's have a fun quiz to test what you've learned!"
          />
        )}

        {onImageAnalyzed && (
          <ImageUpload onImageAnalyzed={onImageAnalyzed}>
            <ActionIcon
              key="upload"
              icon={Upload}
              tooltip="Upload an image!"
              onClick={() => {}}
              className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:scale-110"
            />
          </ImageUpload>
        )}

        {onPanelOpen && (
          <ActionIcon
            key="trophy"
            icon={Trophy}
            tooltip="Check your progress!"
            onClick={onPanelOpen}
            className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 hover:scale-110"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};