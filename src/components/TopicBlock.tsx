import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TopicBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const TopicBlock: React.FC<TopicBlockProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="snap-center"
    >
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-start p-4 rounded-xl w-[200px] h-[120px] transition-all hover:shadow-lg relative overflow-hidden",
          color,
          "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent"
        )}
        onClick={onClick}
      >
        <div className="relative z-10">
          <div className="mb-2 text-2xl">{icon}</div>
          <h3 className="text-lg font-bold mb-1 text-left line-clamp-2">{title}</h3>
          <p className="text-sm text-left opacity-90 line-clamp-2">{description}</p>
        </div>
      </Button>
    </motion.div>
  );
};