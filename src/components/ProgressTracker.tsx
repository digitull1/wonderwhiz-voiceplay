import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Award } from 'lucide-react';

interface ProgressTrackerProps {
  score: number;
  streak: number;
  level: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ score, streak, level }) => {
  return (
    <motion.div 
      className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-medium">{score} points</span>
      </div>
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-medium">{streak} day streak</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium">Level {level}</span>
      </div>
    </motion.div>
  );
};