import React from "react";
import { motion } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface AuthOverlayProps {
  showLogin: boolean;
  onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ showLogin, onClose }) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-white/95 backdrop-blur-xl p-4 
        flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700
            w-8 h-8 flex items-center justify-center rounded-full
            hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            showLinks={false}
            providers={[]}
            view={showLogin ? "sign_in" : "sign_up"}
          />
          <Button
            variant="link"
            onClick={() => onClose()}
            className="mt-4 text-sm text-gray-500"
          >
            {showLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};