import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface CelebrationAnimationProps {
  message?: string;
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ 
  message = "Great job! 🎉" 
}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 50 }}
        transition={{ type: "spring", damping: 12 }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: 1,
            ease: "easeInOut",
          }}
        >
          <Star className="w-16 h-16 text-yellow-400 fill-current" />
        </motion.div>
        <motion.p
          className="text-xl font-bold text-white mt-4 text-center px-6 py-3 bg-primary/90 rounded-full shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};