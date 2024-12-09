import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserProgress } from "@/types/chat";
import { ProgressCard } from "./panel/ProgressCard";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { TimeTracker } from "./panel/TimeTracker";
import { TopicHistory } from "./panel/TopicHistory";
import { X, User, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface CollapsiblePanelProps {
  userProgress?: UserProgress;
  className?: string;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose: () => void;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  userProgress,
  className,
  onLogout,
  isOpen = false,
  onClose
}) => {
  const handleTopicClick = (topic: string) => {
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
        "border-l border-white/20 overflow-y-auto",
        className
      )}
    >
      <div className="sticky top-0 z-10 w-full p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        <ProgressCard userProgress={userProgress} />
        <TimeTracker />
        <TopicHistory onTopicClick={handleTopicClick} />
        <TalkToWizzy />
        
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {}}
          >
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {}}
          >
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};