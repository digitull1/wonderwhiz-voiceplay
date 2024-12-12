import React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface RewardAnimationProps {
  type: "points" | "achievement" | "streak";
  points?: number;
  message?: string;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ 
  type, 
  points, 
  message 
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: type === "achievement" ? 150 : 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [type]);

  return (
    <motion.div
      className={cn(
        "fixed inset-0 pointer-events-none z-50",
        "flex items-center justify-center"
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          "bg-gradient-to-r from-primary to-secondary",
          "rounded-lg shadow-xl p-6 text-white text-center",
          "flex flex-col items-center gap-2"
        )}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
      >
        {points && (
          <motion.div
            className="text-4xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            +{points}
          </motion.div>
        )}
        <motion.div
          className="text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message || (type === "points" ? "Points earned!" : 
            type === "achievement" ? "Achievement unlocked!" : 
            "Daily streak!")}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};