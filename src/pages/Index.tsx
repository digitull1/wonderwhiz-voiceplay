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
        className="min-h-[100dvh] flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="main"
        aria-label="WonderWhiz Chat Interface"
      >
        {/* Magical Background */}
        <div className="fixed inset-0 bg-gradient-luxury opacity-50 transition-opacity duration-1000" />
        <div className="fixed inset-0 bg-stars opacity-10 animate-float" />
        
        {/* Glass Morphism Effect */}
        <div className="fixed inset-0 backdrop-blur-[100px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-[100dvh] w-full">
          <TooltipProvider>
            <CollapsiblePanel 
              userProgress={userProgress}
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

        {/* Ambient Light Effects */}
        <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full blur-[120px] animate-pulse-soft" />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;