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

  // Add auth-related message if user is not authenticated
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
      className="flex-1 container max-w-4xl mx-auto py-4 px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        role="region"
        aria-label="Chat Window"
        tabIndex={0}
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

        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm 
              flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            aria-label="Loading..."
          >
            <motion.div 
              className="bg-white/90 rounded-full p-4 shadow-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};