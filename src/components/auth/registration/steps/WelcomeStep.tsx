import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeStepProps {
  onNext: () => void;
  isLoading?: boolean;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <h2 className="text-2xl font-bold">Welcome to WonderWhiz! 🌟</h2>
      <p className="text-gray-600">
        Let's create your magical learning account! We'll need some information to
        personalize your experience.
      </p>
      <Button 
        onClick={onNext}
        className="w-full"
        disabled={isLoading}
      >
        Let's Begin! 🚀
      </Button>
    </motion.div>
  );
};