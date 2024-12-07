import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Stars, Shapes } from "lucide-react";

export const BackgroundDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          y: [0, -20, 0]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles className="w-32 h-32 float" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 right-20 text-secondary/20"
        animate={{ 
          rotate: -360,
          scale: [1, 1.3, 1],
          x: [0, 20, 0]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Stars className="w-40 h-40 float" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-accent/20"
        animate={{ 
          rotate: 180,
          scale: [1, 1.2, 1],
          y: [0, 30, 0]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Shapes className="w-24 h-24 float" />
      </motion.div>
    </div>
  );
};