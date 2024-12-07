import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  onListen?: (text: string) => void;
  messageText: string;
}

export const MessageActions = ({ 
  onListen,
  messageText 
}: MessageActionsProps) => {
  if (!onListen) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onListen(messageText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="action-icon"
        title="Listen to message"
      >
        <Volume2 className="w-3.5 h-3.5 text-primary/70" />
      </motion.button>
    </motion.div>
  );
};