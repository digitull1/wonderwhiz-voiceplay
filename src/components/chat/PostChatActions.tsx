import React from "react";
import { motion } from "framer-motion";
import { ImageAction } from "./actions/ImageAction";
import { QuizAction } from "./actions/QuizAction";
import { TrophyAction } from "./actions/TrophyAction";

interface PostChatActionsProps {
  messageText: string;
  onPanelOpen?: () => void;
  onQuizGenerated?: (quiz: any) => void;
}

export const PostChatActions = ({ 
  messageText, 
  onPanelOpen,
  onQuizGenerated 
}: PostChatActionsProps) => {
  return (
    <motion.div 
      className="inline-flex items-center gap-1 ml-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.2,
        delay: 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <ImageAction messageText={messageText} />
      <QuizAction messageText={messageText} onQuizGenerated={onQuizGenerated} />
      <TrophyAction onPanelOpen={onPanelOpen} />
    </motion.div>
  );
};