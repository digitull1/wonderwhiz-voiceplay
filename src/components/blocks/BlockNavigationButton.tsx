import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BlockNavigationButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const BlockNavigationButton = ({ 
  direction, 
  onClick,
  className,
  disabled = false
}: BlockNavigationButtonProps) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        direction === 'left' ? "-left-4" : "-right-4",
        className
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "bg-white/90 hover:bg-white shadow-lg",
          "rounded-full p-3 transition-all duration-300",
          "border border-primary/10",
          "group backdrop-blur-sm",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className={cn(
          "h-5 w-5 text-primary",
          "group-hover:scale-110 transition-transform",
          "group-active:scale-95"
        )} />
      </Button>
    </motion.div>
  );
};