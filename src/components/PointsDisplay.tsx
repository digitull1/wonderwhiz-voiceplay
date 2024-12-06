import React from "react";
import { motion } from "framer-motion";
import { Star, Trophy, Award } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface PointsDisplayProps {
  points: number;
  level: number;
  streakDays: number;
}

export const PointsDisplay = ({ points, level, streakDays }: PointsDisplayProps) => {
  return (
    <motion.div 
      className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-medium">{points} points</span>
      </div>
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-medium">{streakDays} day streak</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium">Level {level}</span>
      </div>
    </motion.div>
  );
};