import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./forms/LoginForm";
import { EnhancedRegistrationForm } from "./EnhancedRegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface AuthFormProps {
  onComplete?: () => void;
  isLogin?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onComplete, isLogin = false }) => {
  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Existing session found:', session.user.id);
        onComplete?.();
      }
    };
    
    checkSession();
  }, [onComplete]);

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
        {isLogin ? (
          <LoginForm onComplete={onComplete} />
        ) : (
          <EnhancedRegistrationForm onComplete={onComplete} />
        )}
      </motion.div>
    </motion.div>
  );
};