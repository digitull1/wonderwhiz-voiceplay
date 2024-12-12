import React from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakTrackerProps {
  streakDays: number;
  lastInteractionDate: string;
  className?: string;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  streakDays,
  lastInteractionDate,
  className
}) => {
  const isActiveToday = new Date(lastInteractionDate).toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10",
        "border border-white/20 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: streakDays > 0 ? [0, 15, -15, 0] : 0,
            scale: streakDays > 0 ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
          className="p-2 rounded-full bg-primary/20"
        >
          {streakDays >= 7 ? (
            <Trophy className="w-5 h-5 text-yellow-400" />
          ) : (
            <Calendar className="w-5 h-5 text-primary" />
          )}
        </motion.div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/90">
            {streakDays > 0 ? `${streakDays} Day Streak!` : 'Start Your Streak!'}
          </span>
          <span className="text-xs text-white/70">
            {isActiveToday ? 'Keep it going!' : 'Come back tomorrow to continue'}
          </span>
        </div>

        <div className="ml-auto flex gap-1">
          {[...Array(Math.min(5, streakDays))].map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Star
                className="w-4 h-4 fill-current text-yellow-400"
                strokeWidth={1}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {streakDays >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-center text-white/70"
        >
          🎉 Achievement Unlocked: Week Warrior!
        </motion.div>
      )}
    </motion.div>
  );
};