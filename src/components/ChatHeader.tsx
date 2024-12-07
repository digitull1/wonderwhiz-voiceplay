import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export const ChatHeader = () => {
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
      
      <SheetTrigger asChild>
        <motion.button
          className="bg-gradient-to-r from-primary via-secondary to-accent p-2 rounded-full shadow-lg
            hover:shadow-xl transition-all duration-300 text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      </SheetTrigger>
    </motion.div>
  );
};