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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-4 z-50",
          "bg-white/80 backdrop-blur-xl shadow-luxury border border-white/20",
          "hover:bg-white/90 transition-all duration-300",
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
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4 text-gray-700" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-4 w-4 text-gray-700" />
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
              "bg-white/90 backdrop-blur-xl shadow-luxury",
              "border-l border-white/20 p-6"
            )}
          >
            <div className="pt-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                Your Progress
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-white/50 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700">Topics Explored</h3>
                  <p className="text-2xl font-bold text-primary">
                    {userProgress?.topicsExplored || 0}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700">Questions Asked</h3>
                  <p className="text-2xl font-bold text-secondary">
                    {userProgress?.questionsAsked || 0}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700">Quiz Score</h3>
                  <p className="text-2xl font-bold text-accent">
                    {userProgress?.quizScore || 0}%
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Topics</h3>
                <div className="space-y-2">
                  {userProgress?.recentTopics?.map((topic, index) => (
                    <div
                      key={index}
                      className="bg-white/30 rounded-md p-2 text-sm text-gray-600"
                    >
                      {topic}
                    </div>
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