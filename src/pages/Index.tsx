import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { useChat } from "@/hooks/useChat";
import { Sparkles, Stars, Shapes } from "lucide-react";

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
      <motion.div 
        className="min-h-screen gradient-bg flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CollapsiblePanel userProgress={userProgress} />

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-primary/20"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-32 h-32 float" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-40 right-20 text-secondary/20"
            animate={{ 
              rotate: -360,
              scale: [1, 1.3, 1],
              x: [0, 20, 0]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Stars className="w-40 h-40 float" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-1/4 text-accent/20"
            animate={{ 
              rotate: 180,
              scale: [1, 1.2, 1],
              y: [0, 30, 0]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Shapes className="w-24 h-24 float" />
          </motion.div>
        </div>

        <div className="flex-1 container max-w-4xl mx-auto py-4 px-4 relative z-10">
          <motion.div 
            className="gradient-card rounded-3xl shadow-2xl p-4 h-[calc(100vh-2rem)] 
              flex flex-col border border-white/50 relative overflow-hidden"
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
            />
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSend={() => sendMessage(input)}
              handleVoiceInput={() => {}}
              isLoading={isLoading}
              currentTopic={currentTopic}
              onImageAnalyzed={handleImageAnalysis}
              placeholder={`Ask me anything about ${currentTopic || 'space'}...`}
            />
          </motion.div>
        </div>

        {/* Enhanced decorative gradient orbs */}
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
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;