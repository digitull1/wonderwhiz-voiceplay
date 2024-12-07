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
      className="absolute -right-12 top-0"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleClick}
          size="sm"
          variant="ghost"
          className={cn(
            "relative overflow-hidden group rounded-full p-2",
            "bg-primary/10 hover:bg-primary/20",
            "text-primary hover:text-primary-foreground",
            "transition-all duration-300"
          )}
        >
          <Volume2 className="w-4 h-4" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 rounded-full" />
        </Button>
      </motion.div>
    </motion.div>
  );
};