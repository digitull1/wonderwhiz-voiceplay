import React from "react";
import { motion } from "framer-motion";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface ProfileCompletionProps {
  completedSteps: string[];
  totalSteps: number;
  className?: string;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completedSteps,
  totalSteps,
  className
}) => {
  const completionPercentage = (completedSteps.length / totalSteps) * 100;

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
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/90">Profile Completion</span>
        <span className="text-sm text-white/70">{Math.round(completionPercentage)}%</span>
      </div>

      <Progress
        value={completionPercentage}
        className={cn(
          "h-2 bg-white/10",
          completionPercentage < 50 ? "bg-gradient-to-r from-primary/50 to-primary" :
          completionPercentage < 100 ? "bg-gradient-to-r from-secondary/50 to-secondary" :
          "bg-gradient-to-r from-green-500/50 to-green-500"
        )}
      />

      <div className="mt-2 text-xs text-white/70">
        {completionPercentage < 100 ? (
          <span>Complete your profile to unlock more features!</span>
        ) : (
          <span>🌟 Profile complete! You're all set!</span>
        )}
      </div>

      {completedSteps.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 space-y-1 overflow-hidden"
        >
          {completedSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-xs text-white/60"
            >
              <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                ✓
              </span>
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};