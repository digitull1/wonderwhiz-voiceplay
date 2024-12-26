import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LoadingSparkles = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20" />
        <div className="h-4 w-24 bg-primary/20 rounded" />
      </motion.div>
      
      <div className="space-y-3">
        <div className="h-4 bg-primary/10 rounded w-3/4" />
        <div className="h-4 bg-primary/10 rounded w-1/2" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0],
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};