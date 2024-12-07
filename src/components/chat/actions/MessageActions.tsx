import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Trophy, Upload } from "lucide-react";
import { ActionIcon } from "./ActionIcon";
import { ImageAction } from "./ImageAction";
import { ImageUpload } from "../../ImageUpload";

interface MessageActionsProps {
  onPanelOpen?: () => void;
  messageText: string;
  onImageAnalyzed?: (response: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  onPanelOpen,
  messageText,
  onImageAnalyzed
}) => {
  console.log("MessageActions rendered with props:", { 
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
        {/* Image Generation Icon */}
        <ImageAction key="image" messageText={messageText} />

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