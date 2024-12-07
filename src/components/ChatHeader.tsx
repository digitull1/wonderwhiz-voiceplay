import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { useUserProgress } from "@/hooks/useUserProgress";

export const ChatHeader = () => {
  const { userProgress } = useUserProgress();

  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
        backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.h1 
          className="text-title font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          WonderWhiz
        </motion.h1>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <motion.button
            className="bg-gradient-to-r from-primary via-secondary to-accent p-2 rounded-full shadow-lg
              hover:shadow-xl transition-all duration-300 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <CollapsiblePanel userProgress={userProgress || {
            points: 0,
            level: 1,
            streak_days: 0
          }} />
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};