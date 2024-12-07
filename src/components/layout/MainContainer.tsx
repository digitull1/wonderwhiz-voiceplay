import React from "react";
import { motion } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { BackgroundDecorations } from "./BackgroundDecorations";
import { AuthForm } from "@/components/auth/AuthForm";

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
  isAuthenticated
}) => {
  const [showAuthForm, setShowAuthForm] = React.useState(false);

  const enhancedMessages = React.useMemo(() => {
    if (!isAuthenticated && messages.length > 2) {
      return [
        ...messages,
        {
          text: "Want to save your progress and earn points? Sign up or log in!",
          isAi: true,
          blocks: [],
          showAuthPrompt: true
        }
      ];
    }
    return messages;
  }, [messages, isAuthenticated]);

  return (
    <motion.div 
      className="min-h-screen gradient-bg flex flex-col relative overflow-hidden px-2 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="main"
      aria-label="WonderWhiz Chat Interface"
    >
      <div className="container max-w-5xl mx-auto py-4">
        <motion.div 
          className="gradient-card rounded-3xl shadow-2xl p-4 h-[calc(100vh-2rem)] 
            flex flex-col border border-white/50 relative overflow-hidden
            focus-within:ring-2 focus-within:ring-primary/50 touch-pan-y
            bg-gradient-to-br from-[#F4E7FE]/90 via-[#E8E8FF]/95 to-[#FFFFFF]/90"
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
            messages={enhancedMessages}
            handleListen={handleListen}
            onBlockClick={handleBlockClick}
            quizState={quizState}
            onQuizAnswer={handleQuizAnswer}
            onAuthPromptClick={() => setShowAuthForm(true)}
          />

          {showAuthForm && (
            <motion.div 
              className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-md">
                <button 
                  onClick={() => setShowAuthForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <AuthForm onComplete={() => setShowAuthForm(false)} />
              </div>
            </motion.div>
          )}

          <ChatInput 
            input={input}
            setInput={setInput}
            handleSend={() => sendMessage(input)}
            handleVoiceInput={() => {}}
            isLoading={isLoading}
            currentTopic={currentTopic}
            onImageAnalyzed={handleImageAnalysis}
            placeholder={`Ask me anything about ${currentTopic || 'space'}...`}
            aria-label="Chat input"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};