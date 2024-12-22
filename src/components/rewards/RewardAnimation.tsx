import React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface RewardAnimationProps {
  type?: "points" | "achievement" | "streak" | "quiz" | "image";
  points?: number;
  message?: string;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ 
  type = "achievement", 
  points, 
  message = "Great job! 🎉" 
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
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-xl p-6 text-white text-center"
        initial={{ y: 50, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.8 }}
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
          {message}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};