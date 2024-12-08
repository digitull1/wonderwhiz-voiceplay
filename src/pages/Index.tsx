import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { MainContainer } from "@/components/layout/MainContainer";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { useChat } from "@/hooks/useChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeMessage } from "@/components/auth/WelcomeMessage";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();
  
  const {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    userProgress,
    handleListen,
    handleBlockClick,
    handleQuizAnswer,
    quizState,
    sendMessage,
    handleImageAnalysis,
    isAuthenticated
  } = useChat();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "Come back soon! 👋",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-luxury opacity-50" />
        <div className="fixed inset-0 bg-stars opacity-10 animate-float" />
        <div className="fixed inset-0 backdrop-blur-[100px]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-4">
          <AnimatePresence mode="wait">
            {!showRegistration && !showLogin && (
              <WelcomeMessage
                onRegister={() => setShowRegistration(true)}
                onLogin={() => setShowLogin(true)}
              />
            )}
            
            {showRegistration && (
              <motion.div
                key="registration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
                <button 
                  onClick={() => setShowRegistration(false)}
                  className="mb-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <RegistrationForm />
              </motion.div>
            )}
            
            {showLogin && (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-6"
              >
                <button 
                  onClick={() => setShowLogin(false)}
                  className="mb-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  theme="light"
                  showLinks={false}
                  providers={[]}
                  view="sign_in"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-[100dvh] flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="main"
        aria-label="WonderWhiz Chat Interface"
      >
        <div className="fixed inset-0 bg-gradient-luxury opacity-50 transition-opacity duration-1000" />
        <div className="fixed inset-0 bg-stars opacity-10 animate-float" />
        <div className="fixed inset-0 backdrop-blur-[100px]" />
        
        <div className="relative z-10 flex flex-col h-[100dvh] w-full">
          <TooltipProvider>
            <div className="flex items-center justify-end p-4 bg-white/80 backdrop-blur-sm">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="ml-4"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            <CollapsiblePanel 
              userProgress={userProgress}
              onLogout={handleLogout}
              aria-label="User Progress Panel"
            />

            <BackgroundDecorations />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 w-full h-full"
            >
              <MainContainer 
                messages={messages}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                currentTopic={currentTopic}
                handleListen={handleListen}
                handleBlockClick={handleBlockClick}
                handleQuizAnswer={handleQuizAnswer}
                quizState={quizState}
                sendMessage={sendMessage}
                handleImageAnalysis={handleImageAnalysis}
                isAuthenticated={isAuthenticated}
                userProgress={userProgress}
              />
            </motion.div>
          </TooltipProvider>
        </div>

        <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full blur-[120px] animate-pulse-soft" />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;