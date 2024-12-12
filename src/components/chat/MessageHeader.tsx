import React from "react";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

interface MessageHeaderProps {
  isAi: boolean;
  isTyping: boolean;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ isAi, isTyping }) => {
  if (!isAi || !isTyping) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-primary font-medium px-2"
    >
      <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
      <span>Wonderwhiz is typing...</span>
    </motion.div>
  );
};