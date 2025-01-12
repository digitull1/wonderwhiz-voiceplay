import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatHeader = () => {
  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5",
        "backdrop-blur-sm p-4",
        "border-b border-white/10"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Animated Background */}
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

      {/* Floating Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Container with enhanced glow */}
          <motion.div
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-xl",
              "bg-gradient-to-br from-primary via-secondary to-accent",
              "flex items-center justify-center",
              "shadow-[0_0_15px_rgba(155,135,245,0.5)]",
              "hover:shadow-[0_0_25px_rgba(155,135,245,0.7)]",
              "hover:scale-105",
              "transition-all duration-300"
            )}
            whileHover={{ 
              rotate: [0, -5, 5, 0],
              scale: 1.1,
            }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10 animate-sparkle" />
          </motion.div>
          
          {/* Title and Subtitle with adjusted spacing */}
          <div className="flex flex-col items-start justify-center h-full">
            <motion.h1 
              className={cn(
                "text-xl sm:text-2xl font-bold",
                "tracking-tight leading-none mb-1"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wonder</span>
              <span className="text-primary">Whiz</span>
            </motion.h1>
            <motion.p
              className={cn(
                "text-xs sm:text-sm text-gray-600",
                "flex items-center gap-1",
                "font-medium leading-none"
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
      </div>
    </motion.div>
  );
};