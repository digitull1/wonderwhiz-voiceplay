import React from "react";
import { motion } from "framer-motion";

export const ChatHeader = () => {
  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
        backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-title font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        WonderWhiz
      </motion.h1>
    </motion.div>
  );
};