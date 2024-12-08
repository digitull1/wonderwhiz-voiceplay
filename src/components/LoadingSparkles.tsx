import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSparkles = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 text-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 360],
            y: [-20, 20, -20]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
      <motion.div
        className="text-white text-lg font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Creating magic...
      </motion.div>
    </div>
  );
};