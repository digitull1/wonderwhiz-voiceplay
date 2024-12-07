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
  console.log("MessageActions rendered with props:", { 
    hasListenHandler: !!onListen,
    hasQuizHandler: !!onQuizGenerated,
    hasImageHandler: !!onImageAnalyzed
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
        {/* Listen Icon */}
        {onListen && (
          <ActionIcon
            key="listen"
            icon={Volume2}
            tooltip="Listen to this message!"
            onClick={() => onListen(messageText)}
            className="bg-gradient-to-br from-primary/20 to-secondary/20 hover:scale-110"
          />
        )}

        {/* Image Generation Icon */}
        <ImageAction key="image" messageText={messageText} />

        {/* Quiz Icon */}
        {onQuizGenerated && (
          <QuizAction
            key="quiz"
            onQuizGenerated={onQuizGenerated}
            messageText={messageText}
            icon={BookOpen}
            tooltip="Let's have a fun quiz to test what you've learned!"
            className="bg-gradient-to-br from-accent/20 to-primary/20 hover:scale-110"
          />
        )}

        {/* Image Upload Icon */}
        {onImageAnalyzed && (
          <ImageUpload onImageAnalyzed={onImageAnalyzed}>
            <ActionIcon
              key="upload"
              icon={Upload}
              tooltip="Upload an image!"
              onClick={() => {}}
              className="bg-gradient-to-br from-primary/20 to-accent/20 hover:scale-110"
            />
          </ImageUpload>
        )}

        {/* Trophy Icon */}
        {onPanelOpen && (
          <ActionIcon
            key="trophy"
            icon={Trophy}
            tooltip="View your progress!"
            onClick={onPanelOpen}
            className="bg-gradient-to-br from-accent/20 to-secondary/20 hover:scale-110"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};