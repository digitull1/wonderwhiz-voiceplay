import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RewardAnimation } from "../rewards/RewardAnimation";

interface MessageContainerProps {
  isAi: boolean;
  showReward: boolean;
  children: React.ReactNode;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ 
  isAi, 
  showReward, 
  children 
}) => {
  return (
    <>
      {showReward && <RewardAnimation type="points" points={5} />}
      
      <motion.div 
        className={cn(
          "flex w-full",
          isAi ? "bg-gradient-luxury" : "bg-white/5"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={cn(
          "w-full max-w-full mx-auto flex flex-col items-start gap-2",
          "px-3 sm:px-4 md:px-6",
          isAi ? "py-4 sm:py-6" : "py-3 sm:py-4"
        )}>
          {children}
        </div>
      </motion.div>
    </>
  );
};