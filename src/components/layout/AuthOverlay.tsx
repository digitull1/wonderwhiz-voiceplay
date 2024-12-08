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
      className="fixed inset-0 bg-white/95 backdrop-blur-xl p-4 
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
          <h2 className="text-2xl font-bold mb-6 text-center">
            {showLogin ? "Welcome Back!" : "Join WonderWhiz"}
          </h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            view={showLogin ? "sign_in" : "sign_up"}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </motion.div>
  );
};