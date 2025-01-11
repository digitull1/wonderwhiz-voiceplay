import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ChatHeader = () => {
  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
        backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-luxury"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="flex items-center gap-3">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary 
            flex items-center justify-center shadow-xl relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="flex flex-col items-start">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent 
              bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            WonderWhiz
          </motion.h1>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your Magical Learning Friend ✨
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};