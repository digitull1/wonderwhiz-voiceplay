import React from "react";
import { motion } from "framer-motion";
import { RegistrationForm } from "./forms/RegistrationForm";
import { LoginForm } from "./forms/LoginForm";

interface AuthFormProps {
  onComplete?: () => void;
  isLogin?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onComplete, isLogin = false }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Welcome Back! ✨" : "Join WonderWhiz! 🌟"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? "Continue your magical learning journey" 
              : "Let's create your magical learning account"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onComplete={onComplete} />
        ) : (
          <RegistrationForm onComplete={onComplete} />
        )}
      </motion.div>
    </motion.div>
  );
};