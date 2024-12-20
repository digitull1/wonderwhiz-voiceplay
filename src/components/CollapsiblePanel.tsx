import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProgress } from "@/types/chat";
import { ProgressCard } from "./panel/ProgressCard";
import { TimeTracker } from "./panel/TimeTracker";
import { TopicHistory } from "./panel/TopicHistory";
import { X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { ProfileSettings } from "./profile/ProfileSettings";
import { cn } from "@/lib/utils";

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-40 h-full w-96",
              "bg-white/95 backdrop-blur-xl shadow-luxury",
              "border-l border-white/20",
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

            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-6 space-y-6">
                <ProgressCard userProgress={userProgress} />
                <TimeTracker />
                <TopicHistory onTopicClick={() => {}} />
                <ProfileSettings />
                
                {onLogout && (
                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={onLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};