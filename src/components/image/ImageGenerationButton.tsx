import React from "react";
import { Button } from "../ui/button";
import { Image, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGenerationButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ImageGenerationButton = ({ onClick, isLoading }: ImageGenerationButtonProps) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            Creating magic...
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Image className="w-4 h-4" />
            Generate Picture
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  </motion.div>
);