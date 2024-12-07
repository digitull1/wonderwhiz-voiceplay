import React from "react";
import { Clock } from "lucide-react";
import { TimeTrackerRing } from "./TimeTrackerRing";
import { motion } from "framer-motion";

interface TimeTrackerProps {
  timeSpent: {
    today: number;
    week: number;
  };
}

export const TimeTracker = ({ timeSpent }: TimeTrackerProps) => {
  // Calculate percentages based on daily and weekly goals
  const dailyGoal = 60; // 60 minutes per day goal
  const weeklyGoal = 300; // 300 minutes per week goal (5 hours)
  
  const todayPercentage = Math.min((timeSpent.today / dailyGoal) * 100, 100);
  const weekPercentage = Math.min((timeSpent.week / weeklyGoal) * 100, 100);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold">Learning Time</h3>
      </div>
      
      <div className="flex justify-around items-center gap-4">
        <TimeTrackerRing
          percentage={todayPercentage}
          color="stroke-secondary"
          label="Today"
          time={formatTime(timeSpent.today)}
          size={100}
          goal={dailyGoal}
        />
        <TimeTrackerRing
          percentage={weekPercentage}
          color="stroke-primary"
          label="This Week"
          time={formatTime(timeSpent.week)}
          size={100}
          goal={weeklyGoal}
        />
      </div>
      
      <motion.div 
        className="mt-3 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {timeSpent.today === 0 && timeSpent.week === 0 ? (
          "Start your learning journey today! 🌟"
        ) : (
          `${formatTime(timeSpent.today)} today - Keep going! ✨`
        )}
      </motion.div>
    </motion.div>
  );
};