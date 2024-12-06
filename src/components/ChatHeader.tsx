import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Zap, Trophy, Award, Crown } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const ChatHeader = () => {
  const { userProgress } = useUserProgress();
  
  const getLevelColor = (level: number) => {
    if (level < 5) return "text-level-beginner";
    if (level < 10) return "text-level-intermediate";
    if (level < 15) return "text-level-advanced";
    return "text-level-expert";
  };

  const getRewardIcon = (points: number) => {
    if (points < 100) return null;
    if (points < 500) return <Trophy className="w-4 h-4 text-reward-bronze" />;
    if (points < 1000) return <Award className="w-4 h-4 text-reward-silver" />;
    return <Crown className="w-4 h-4 text-reward-gold" />;
  };

  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
        backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
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
            className="text-title font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
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
                  className={`flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full ${getLevelColor(userProgress.level)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring" }}
                >
                  <Star className="w-4 h-4" />
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
                  className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-secondary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  {getRewardIcon(userProgress.points)}
                  <Zap className="w-4 h-4" />
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
                <div className="space-y-2">
                  <p>Points earned through learning!</p>
                  <div className="text-xs">
                    <p>🥉 Bronze: 100 points</p>
                    <p>🥈 Silver: 500 points</p>
                    <p>🥇 Gold: 1000 points</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip key="streak">
              <TooltipTrigger>
                <motion.div
                  className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <span>🔥</span>
                  <motion.span
                    key={userProgress.streak_days}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
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