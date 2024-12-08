import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserProgress } from "@/types/chat";
import { ProgressCard } from "./panel/ProgressCard";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { TimeTracker } from "./panel/TimeTracker";
import { TopicHistory } from "./panel/TopicHistory";

interface CollapsiblePanelProps {
  userProgress?: UserProgress;
  className?: string;
  onLogout?: () => void;
  isOpen?: boolean;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  userProgress,
  className,
  onLogout,
  isOpen = false
}) => {
  const handleTopicClick = (topic: string) => {
    console.log('Topic clicked:', topic);
    const event = new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `Tell me about "${topic}"`,
        isAi: false
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "fixed top-0 right-0 z-40 h-full w-80",
        "bg-white/95 backdrop-blur-xl shadow-luxury",
        "border-l border-white/20 p-6 overflow-y-auto",
        "transition-transform duration-300",
        className
      )}
    >
      <div className="pt-20 space-y-6">
        <ProgressCard userProgress={userProgress} />
        <TimeTracker />
        <TopicHistory onTopicClick={handleTopicClick} />
        <TalkToWizzy />
      </div>
    </motion.div>
  );
};