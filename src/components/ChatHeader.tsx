import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const ChatHeader = () => {
  const { userProgress } = useUserProgress();

  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-primary backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="relative"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <div>
          <motion.h1 
            className="text-title font-bold bg-gradient-to-r from-primary via-block-pink to-block-blue bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            WonderWhiz
          </motion.h1>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-2 text-small">
          <AnimatePresence mode="wait">
            <Tooltip key="level">
              <TooltipTrigger>
                <motion.div
                  className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring" }}
                >
                  <Star className="w-4 h-4 text-primary" />
                  <motion.span
                    key={userProgress.level}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                  >
                    Level {userProgress.level}
                  </motion.span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current level! Keep learning to level up!</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip key="points">
              <TooltipTrigger>
                <motion.div
                  className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <Zap className="w-4 h-4 text-secondary" />
                  <motion.span
                    key={userProgress.points}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                  >
                    {userProgress.points} Points
                  </motion.span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Points earned through learning!</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip key="streak">
              <TooltipTrigger>
                <motion.div
                  className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <span className="text-accent">🔥</span>
                  <motion.span
                    key={userProgress.streak_days}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-accent"
                  >
                    {userProgress.streak_days}d
                  </motion.span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{userProgress.streak_days} day streak! Keep it up!</p>
              </TooltipContent>
            </Tooltip>
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};