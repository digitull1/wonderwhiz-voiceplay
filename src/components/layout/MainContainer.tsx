import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { AuthOverlay } from "./AuthOverlay";
import { TopNavigation } from "./TopNavigation";
import { UserProgress } from "@/types/chat";

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

  const handleAuthClick = (isLogin: boolean) => {
    setShowLogin(isLogin);
    setShowAuthForm(true);
  };

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
        <TopNavigation 
          isAuthenticated={isAuthenticated}
          onPanelToggle={() => setIsPanelOpen(!isPanelOpen)}
          onLogout={onLogout}
          onAuthClick={handleAuthClick}
        />

        <ChatHeader />

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
            onAuthPromptClick={() => handleAuthClick(false)}
          />

          <AnimatePresence>
            {showAuthForm && (
              <AuthOverlay 
                showLogin={showLogin}
                onClose={() => setShowAuthForm(false)}
              />
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