import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  onRegister,
  onLogin
}) => {
  return (
    <motion.div 
      className="text-center space-y-6 max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold">
        Hi! I'm WonderWhiz! Your friendly AI Assistant! Please login or register to continue 😊
      </h1>
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onRegister}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
        >
          Register
        </Button>
        <Button 
          onClick={onLogin}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-primary border-primary px-8 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
        >
          Login
        </Button>
      </div>
    </motion.div>
  );
};