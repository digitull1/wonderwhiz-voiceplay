import React from "react";
import { AnimatePresence } from "framer-motion";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { MainContainer } from "@/components/layout/MainContainer";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { useChat } from "@/hooks/useChat";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    handleImageAnalysis
  } = useChat();

  return (
    <AnimatePresence>
      <div 
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
          />

          {/* Enhanced decorative gradient orbs */}
          <div aria-hidden="true">
            <motion.div 
              className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-primary/30 rounded-full 
                filter blur-[100px] opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/30 rounded-full 
                filter blur-[100px] opacity-50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </TooltipProvider>
      </div>
    </AnimatePresence>
  );
};

export default Index;