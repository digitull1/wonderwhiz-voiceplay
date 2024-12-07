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
  const todayPercentage = Math.min((timeSpent.today / 60) * 100, 100);
  const weekPercentage = Math.min((timeSpent.week / 300) * 100, 100);

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold">Learning Time</h3>
      </div>
      
      <div className="flex justify-around items-center gap-4">
        <TimeTrackerRing
          percentage={todayPercentage}
          color="stroke-secondary"
          label="Today"
          time={`${timeSpent.today}m`}
          size={100}
        />
        <TimeTrackerRing
          percentage={weekPercentage}
          color="stroke-primary"
          label="This Week"
          time={`${timeSpent.week}m`}
          size={100}
        />
      </div>
      
      <motion.div 
        className="mt-2 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Keep learning to fill your rings! 🌟
      </motion.div>
    </motion.div>
  );
};