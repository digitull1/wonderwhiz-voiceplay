import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ImageIcon, BookOpen, Trophy } from "lucide-react";
import { ActionIcon } from "./ActionIcon";
import { QuizAction } from "./QuizAction";
import { ImageAction } from "./ImageAction";
import { ImageUpload } from "../../ImageUpload";

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
    hasImageHandler: !!onImageAnalyzed,
    hasPanelHandler: !!onPanelOpen
  });

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm">
      {/* Listen Icon */}
      {onListen && (
        <ActionIcon
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
          onQuizGenerated={onQuizGenerated}
          messageText={messageText}
          icon={BookOpen}
          tooltip="Let's have a fun quiz!"
          className="bg-gradient-to-br from-accent/20 to-primary/20 hover:scale-110"
        />
      )}

      {/* Image Upload Icon */}
      {onImageAnalyzed && (
        <ImageUpload onImageAnalyzed={onImageAnalyzed}>
          <ActionIcon
            icon={ImageIcon}
            tooltip="Upload an image!"
            onClick={() => {}}
            className="bg-gradient-to-br from-primary/20 to-accent/20 hover:scale-110"
          />
        </ImageUpload>
      )}

      {/* Trophy Icon */}
      {onPanelOpen && (
        <ActionIcon
          icon={Trophy}
          tooltip="View your progress!"
          onClick={onPanelOpen}
          className="bg-gradient-to-br from-accent/20 to-secondary/20 hover:scale-110"
        />
      )}
    </div>
  );
};