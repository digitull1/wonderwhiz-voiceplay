import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProgress } from "@/types/chat";
import { ProgressCard } from "./panel/ProgressCard";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { TimeTracker } from "./panel/TimeTracker";
import { TopicHistory } from "./panel/TopicHistory";

interface CollapsiblePanelProps {
  userProgress?: UserProgress;
  className?: string;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  userProgress,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    console.log('Toggle panel:', !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "fixed top-4 right-4 z-50",
          "bg-white/95 backdrop-blur-xl shadow-luxury border border-white/20",
          "hover:bg-white hover:scale-110 active:scale-95",
          "transition-all duration-300",
          className
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && userProgress && (
          <motion.div 
            className="absolute -bottom-4 -right-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {userProgress.points}
          </motion.div>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-40 h-full w-80",
              "bg-white/95 backdrop-blur-xl shadow-luxury",
              "border-l border-white/20 p-6 overflow-y-auto"
            )}
          >
            <div className="pt-14 space-y-6">
              <ProgressCard userProgress={userProgress} />
              {userProgress && (
                <TimeTracker timeSpent={{ today: 0, week: 0 }} />
              )}
              <TopicHistory topics={[]} onTopicClick={() => {}} />
              <TalkToWizzy />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};