import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const LoadingSparkles = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
      </motion.div>
    </div>
  );
};