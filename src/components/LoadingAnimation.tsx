import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const LoadingAnimation = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>
      <motion.p
        className="text-primary font-medium text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Creating something magical...
      </motion.p>
    </motion.div>
  );
};