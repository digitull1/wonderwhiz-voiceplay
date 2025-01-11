import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { AuthForm } from "@/components/auth/AuthForm";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { UserProgress } from "@/types/chat";
import { BackgroundDecorations } from "./BackgroundDecorations";

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
  userProgress
}) => {
  const [showAuthForm, setShowAuthForm] = React.useState(false);

  return (
    <motion.div 
      className="h-[100dvh] w-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackgroundDecorations />
      
      <div className="relative z-10 w-full h-full flex flex-col px-4 md:px-6">
        <motion.div 
          className="flex-1 flex flex-col h-full relative overflow-hidden max-w-5xl mx-auto w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <ChatHeader />
          
          <ChatContainer 
            messages={messages}
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
                <motion.div 
                  className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <button 
                    onClick={() => setShowAuthForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700
                      w-8 h-8 flex items-center justify-center rounded-full
                      hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                  <AuthForm onComplete={() => setShowAuthForm(false)} />
                </motion.div>
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

      <CollapsiblePanel userProgress={userProgress} />
    </motion.div>
  );
};