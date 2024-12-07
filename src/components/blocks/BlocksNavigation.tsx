import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlocksNavigationProps {
  onScroll: (direction: 'left' | 'right') => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export const BlocksNavigation = ({ 
  onScroll,
  canScrollLeft,
  canScrollRight
}: BlocksNavigationProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  return (
    <>
      {canScrollLeft && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        >
          <Button
            variant="ghost"
            className={cn(
              "bg-white/90 hover:bg-white shadow-lg",
              "rounded-full p-3 transition-all duration-300",
              "border border-gray-200",
              "group"
            )}
            onClick={() => onScroll('left')}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      )}
      
      {canScrollRight && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        >
          <Button
            variant="ghost"
            className={cn(
              "bg-white/90 hover:bg-white shadow-lg",
              "rounded-full p-3 transition-all duration-300",
              "border border-gray-200",
              "group"
            )}
            onClick={() => onScroll('right')}
          >
            <ChevronRight className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      )}
    </>
  );
};