import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";

export const ChatHeader = () => {
  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 relative">
        <motion.div
          className="relative"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <div className="flex flex-col">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            WonderWhiz
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your magical learning companion ✨
          </motion.p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.4 }}
        >
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Level 1</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <Zap className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-secondary">0 Points</span>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl" />
    </motion.div>
  );
};