import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatHeader = () => {
  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10",
        "backdrop-blur-xl rounded-2xl p-6 mb-6",
        "border border-white/20 shadow-luxury"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.5, 0.3, 0.5] 
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative flex items-center gap-4">
        {/* Logo Container */}
        <motion.div
          className={cn(
            "w-12 h-12 rounded-xl",
            "bg-gradient-to-br from-primary to-secondary",
            "flex items-center justify-center shadow-xl",
            "hover:shadow-2xl hover:scale-105",
            "transition-all duration-300"
          )}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Sparkles className="w-6 h-6 text-white relative z-10" />
        </motion.div>
        
        {/* Title and Subtitle */}
        <div className="flex flex-col items-start">
          <motion.h1 
            className={cn(
              "text-2xl font-bold",
              "bg-gradient-to-r from-primary via-secondary to-accent",
              "bg-clip-text text-transparent",
              "tracking-tight leading-none"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            WonderWhiz
          </motion.h1>
          <motion.p
            className={cn(
              "text-sm text-gray-600",
              "flex items-center gap-1.5",
              "mt-1 font-medium"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your Magical Learning Friend 
            <span className="inline-block animate-bounce-subtle">✨</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};