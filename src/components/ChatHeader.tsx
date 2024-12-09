import React from "react";
import { motion } from "framer-motion";

export const ChatHeader = () => {
  return (
    <motion.div 
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          WonderWhiz
        </motion.h1>
      </div>
    </motion.div>
  );
};