import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ActionIconProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ActionIcon: React.FC<ActionIconProps> = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  isLoading,
  className 
}) => {
  console.log("ActionIcon rendered:", { tooltip, isLoading });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button 
            className={cn(
              "action-icon",
              "relative p-2 rounded-full transition-all duration-300",
              "bg-white/90 backdrop-blur-sm shadow-sm border border-white/20",
              "hover:bg-white hover:scale-110 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </motion.div>
              ) : (
                <Icon className="w-4 h-4 text-primary" />
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};