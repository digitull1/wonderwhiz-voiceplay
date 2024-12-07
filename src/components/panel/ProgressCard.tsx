import React from "react";
import { Star } from "lucide-react";

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
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-primary">Level {userProgress.level}</h3>
          <p className="text-sm text-gray-600">⭐ {userProgress.points} Points</p>
          <p className="text-sm text-gray-600">🔥 {userProgress.streak_days} Day Streak</p>
        </div>
        <Star className="w-8 h-8 text-primary animate-pulse" />
      </div>
    </div>
  );
};