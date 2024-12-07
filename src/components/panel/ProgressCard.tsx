import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressCardProps {
  userProgress: {
    points: number;
    level: number;
    streak_days: number;
  };
}

export const ProgressCard = ({ userProgress }: ProgressCardProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.h3 
            className="text-lg font-semibold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Level {userProgress.level}
          </motion.h3>
          <motion.p 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            ⭐ {userProgress.points} Points
          </motion.p>
          <motion.p 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🔥 {userProgress.streak_days} Day Streak
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <Star className="w-8 h-8 text-primary animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};