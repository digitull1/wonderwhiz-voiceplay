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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface CollapsiblePanelProps {
  userProgress?: UserProgress;
  className?: string;
  onLogout?: () => void;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  userProgress,
  className,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    console.log('Toggle panel:', !isOpen);
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      if (onLogout) onLogout();
      toast({
        title: "Logged out successfully",
        description: "Come back soon! 👋",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleTopicClick = (topic: string) => {
    console.log('Topic clicked:', topic);
    setIsOpen(false);
    const event = new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `Tell me about "${topic}"`,
        isAi: false
      }
    });
    window.dispatchEvent(event);
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
              <TimeTracker />
              <TopicHistory onTopicClick={handleTopicClick} />
              <TalkToWizzy />
              
              {/* Profile Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Profile</h3>
                {userProgress && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Level {userProgress.level}
                    </p>
                    <p className="text-sm text-gray-600">
                      {userProgress.points} Points
                    </p>
                    <p className="text-sm text-gray-600">
                      {userProgress.streak_days} Day Streak
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};