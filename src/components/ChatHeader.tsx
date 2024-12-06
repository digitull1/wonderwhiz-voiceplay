import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ChatHeader = () => {
  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          WonderWhiz
        </h1>
      </div>
    </motion.div>
  );
};