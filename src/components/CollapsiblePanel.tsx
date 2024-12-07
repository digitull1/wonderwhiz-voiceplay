import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProgress } from "@/types/chat";

interface CollapsiblePanelProps {
  userProgress?: UserProgress;
  className?: string;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  userProgress,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getEmoji = (value: number) => {
    if (value > 75) return "🌟";
    if (value > 50) return "⭐";
    if (value > 25) return "✨";
    return "🎯";
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
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
              <X className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Menu className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
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
              "border-l border-white/20 p-6"
            )}
          >
            <div className="pt-14">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-app-text-dark mb-6"
              >
                Your Amazing Journey! 🚀
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-block-purple to-block-blue rounded-xl p-4 shadow-block text-white">
                  <h3 className="text-sm font-medium opacity-90">Topics Explored</h3>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {userProgress?.topicsExplored || 0}
                    {getEmoji(userProgress?.topicsExplored || 0)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-block-orange to-block-purple rounded-xl p-4 shadow-block text-white">
                  <h3 className="text-sm font-medium opacity-90">Questions Asked</h3>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {userProgress?.questionsAsked || 0}
                    {getEmoji(userProgress?.questionsAsked || 0)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-block-blue to-block-orange rounded-xl p-4 shadow-block text-white">
                  <h3 className="text-sm font-medium opacity-90">Quiz Score</h3>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {userProgress?.quizScore || 0}%
                    {getEmoji(userProgress?.quizScore || 0)}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-sm font-medium text-app-text-dark mb-3">
                  Recent Adventures ✨
                </h3>
                <div className="space-y-2">
                  {userProgress?.recentTopics?.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-gradient-to-r from-white/50 to-white/30 
                        backdrop-blur-sm rounded-lg p-3 text-sm text-app-text-dark
                        border border-white/20 shadow-sm"
                    >
                      {topic}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};