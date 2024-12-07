import React from "react";
import { motion } from "framer-motion";
import { Image, BookOpen, Star, Trophy } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const ActionButton = ({ 
  icon: Icon, 
  tooltip 
}: { 
  icon: React.ElementType; 
  tooltip: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button 
          className="action-icon bg-gradient-to-br from-primary/20 to-secondary/20
            hover:from-primary/30 hover:to-secondary/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PostChatActions = () => {
  const actions = [
    { icon: Image, tooltip: "Create a picture for this!" },
    { icon: BookOpen, tooltip: "Test your knowledge!" },
    { icon: Star, tooltip: "You've earned points for learning!" },
    { icon: Trophy, tooltip: "Level up your adventures!" }
  ];

  return (
    <motion.div 
      className="post-chat-actions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </motion.div>
  );
};