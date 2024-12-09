import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimeTrackerRingProps {
  timeSpent: number;  // Add this prop
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  goal?: number;
  isLoading?: boolean;  // Add this prop
}

export const TimeTrackerRing = ({
  timeSpent = 0,  // Default to 0
  size = 120,
  strokeWidth = 8,
  color = "stroke-secondary",
  label = "Learning Time",
  goal = 30,  // Default goal of 30 minutes
  isLoading = false
}: TimeTrackerRingProps) => {
  // Calculate percentage, ensuring it doesn't exceed 100%
  const percentage = Math.min((timeSpent / goal) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (percentage * circumference) / 100;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse w-32 h-32 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100"
          />
          
          {/* Animated progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={cn("ring-progress", color)}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {timeSpent}m
          </motion.span>
          <motion.span 
            className="text-sm text-gray-600 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {label}
          </motion.span>
        </div>
      </div>
      <motion.div 
        className="mt-2 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Goal: {goal}m
      </motion.div>
    </div>
  );
};