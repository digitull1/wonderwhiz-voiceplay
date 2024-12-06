import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Volume2, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  onListen?: () => void;
  shouldShowImageGen?: boolean;
  messageText: string;
}

export const MessageActions = ({ 
  onListen, 
  shouldShowImageGen,
  messageText 
}: MessageActionsProps) => {
  return (
    <div className="flex gap-2">
      {onListen && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onListen}
            size="sm"
            variant="ghost"
            className={cn(
              "relative overflow-hidden group",
              "bg-primary/10 hover:bg-primary/20",
              "text-primary hover:text-primary-foreground",
              "transition-all duration-300"
            )}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            <span className="text-sm">Listen</span>
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
          </Button>
        </motion.div>
      )}

      {shouldShowImageGen && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "relative overflow-hidden group",
              "bg-secondary/10 hover:bg-secondary/20",
              "text-secondary hover:text-secondary-foreground",
              "transition-all duration-300"
            )}
          >
            <Image className="w-4 h-4 mr-2" />
            <span className="text-sm">Generate Image</span>
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-300" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};