import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { AuthForm } from "@/components/auth/AuthForm";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { UserProgress } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

interface MainContainerProps {
  messages: any[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  currentTopic: string;
  handleListen: (text: string) => void;
  handleBlockClick: (block: any) => void;
  handleQuizAnswer: (isCorrect: boolean) => void;
  quizState: any;
  sendMessage: (message: string) => void;
  handleImageAnalysis: (response: string) => void;
  isAuthenticated: boolean;
  userProgress: UserProgress;
  onLogout: () => void;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  messages,
  input,
  setInput,
  isLoading,
  currentTopic,
  handleListen,
  handleBlockClick,
  handleQuizAnswer,
  quizState,
  sendMessage,
  handleImageAnalysis,
  isAuthenticated,
  userProgress,
  onLogout
}) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const welcomeMessage = {
    text: "Hi! I'm WonderWhiz! Your friendly AI Assistant! Please login or register to continue 😊",
    isAi: true,
    showAuthPrompt: !isAuthenticated
  };

  const displayMessages = isAuthenticated ? messages : [welcomeMessage];

  return (
    <motion.div 
      className="h-[100dvh] w-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-luxury opacity-50" />
      
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
          <ChatHeader />
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onLogout}
                  className="text-primary"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="text-primary"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setShowAuthForm(true);
                    setShowLogin(false);
                  }}
                  className="text-primary"
                >
                  Register
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setShowAuthForm(true);
                    setShowLogin(true);
                  }}
                  className="text-primary"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        <motion.div 
          className="flex-1 flex flex-col h-full relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChatContainer 
            messages={displayMessages}
            handleListen={handleListen}
            onBlockClick={handleBlockClick}
            quizState={quizState}
            onQuizAnswer={handleQuizAnswer}
            onAuthPromptClick={() => setShowAuthForm(true)}
          />

          <AnimatePresence>
            {showAuthForm && (
              <motion.div 
                className="absolute inset-0 bg-white/95 backdrop-blur-xl p-4 
                  flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-full max-w-md">
                  <button 
                    onClick={() => setShowAuthForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700
                      w-8 h-8 flex items-center justify-center rounded-full
                      hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                  {showLogin ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="light"
                        showLinks={false}
                        providers={[]}
                        view="sign_in"
                      />
                      <Button
                        variant="link"
                        onClick={() => setShowLogin(false)}
                        className="mt-4 text-sm text-gray-500"
                      >
                        Don't have an account? Register
                      </Button>
                    </div>
                  ) : (
                    <>
                      <AuthForm onComplete={() => setShowAuthForm(false)} />
                      <Button
                        variant="link"
                        onClick={() => setShowLogin(true)}
                        className="mt-4 text-sm text-gray-500"
                      >
                        Already have an account? Sign in
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatInput 
            input={input}
            setInput={setInput}
            handleSend={() => sendMessage(input)}
            handleVoiceInput={() => {}}
            isLoading={isLoading}
            currentTopic={currentTopic}
            onImageAnalyzed={handleImageAnalysis}
            placeholder="Ask me something magical..."
          />
        </motion.div>
      </div>

      <CollapsiblePanel 
        userProgress={userProgress} 
        onLogout={onLogout}
        className={isPanelOpen ? "" : "translate-x-full"}
      />
    </motion.div>
  );
};