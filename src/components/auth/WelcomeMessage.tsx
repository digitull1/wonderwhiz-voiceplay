import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthForm } from "./AuthForm";

interface WelcomeMessageProps {
  onComplete?: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onComplete }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthComplete = () => {
    setShowAuth(false);
    setIsLoading(false);
    onComplete?.();
  };

  return (
    <>
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
            onClick={() => {
              setIsLogin(false);
              setShowAuth(true);
            }}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Register"
            )}
          </Button>
          <Button 
            onClick={() => {
              setIsLogin(true);
              setShowAuth(true);
            }}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-primary border-primary px-8 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAuth && (
          <AuthForm 
            isLogin={isLogin}
            onComplete={handleAuthComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
};