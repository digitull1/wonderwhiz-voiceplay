import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionIconProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ActionIcon = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  isLoading,
  className 
}: ActionIconProps) => (
  <motion.button 
    className={cn(
      "relative p-1.5 rounded-full transition-all duration-300",
      "bg-gradient-to-br from-primary/5 to-secondary/5",
      "hover:from-primary/10 hover:to-secondary/10",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      className
    )}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={isLoading}
    title={tooltip}
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-3 h-3 animate-spin text-primary/70" />
        </motion.div>
      ) : (
        <Icon className="w-3 h-3 text-primary/70" />
      )}
    </AnimatePresence>
  </motion.button>
);