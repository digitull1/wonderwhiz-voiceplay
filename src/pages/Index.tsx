import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { MainContainer } from "@/components/layout/MainContainer";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { useChat } from "@/hooks/useChat";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
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

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen gradient-bg flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="main"
        aria-label="WonderWhiz Chat Interface"
      >
        <TooltipProvider>
          <CollapsiblePanel 
            userProgress={userProgress}
            aria-label="User Progress Panel"
          />

          <BackgroundDecorations />

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
          />
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;