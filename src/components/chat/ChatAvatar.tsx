import React from "react";
import { motion } from "framer-motion";

export const ChatAvatar = () => (
  <motion.div 
    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg relative flex-shrink-0"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <motion.div
      className="absolute inset-0 rounded-full bg-white/20"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="text-white text-xl">✨</span>
  </motion.div>
);