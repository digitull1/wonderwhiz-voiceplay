import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopicBlockProps {
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const TopicBlock: React.FC<TopicBlockProps> = ({
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-start p-6 rounded-xl w-[280px] h-[160px] transition-all",
        "hover:shadow-xl relative overflow-hidden text-white",
        color,
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        "after:content-[''] after:absolute after:inset-0 after:bg-black/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
      )}
      onClick={onClick}
    >
      <motion.div 
        className="relative z-10 h-full flex flex-col justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold mb-2 text-left line-clamp-2">{title}</h3>
        <p className="text-sm text-left opacity-90 line-clamp-2">{description}</p>
      </motion.div>
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 bg-white rounded-tl-full transform translate-x-6 translate-y-6" />
      <motion.div 
        className="absolute top-2 right-2"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-2xl">✨</span>
      </motion.div>
    </motion.button>
  );
};