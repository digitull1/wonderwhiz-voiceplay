import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BlockNavigationButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export const BlockNavigationButton = ({ direction, onClick }: BlockNavigationButtonProps) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        direction === 'left' ? "left-0" : "right-0"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "bg-white/90 hover:bg-white shadow-lg",
          "rounded-full p-3 transition-all duration-300",
          "border border-gray-200",
          "group"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
      </Button>
    </motion.div>
  );
};