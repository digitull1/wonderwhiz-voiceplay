import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { Sparkles, Stars } from "lucide-react";

const Index = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    handleListen,
    handleBlockClick,
    sendMessage,
    handleImageAnalysis
  } = useChat();

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-primary/20"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-32 h-32" />
          </motion.div>
          <motion.div
            className="absolute bottom-40 right-20 text-secondary/20"
            animate={{ 
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Stars className="w-40 h-40" />
          </motion.div>
        </div>

        <div className="flex-1 container max-w-4xl mx-auto py-8 px-4 relative">
          <motion.div 
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 h-[calc(100vh-4rem)] flex flex-col border border-white/50"
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
            />
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSend={() => sendMessage(input)}
              handleVoiceInput={() => {}}
              isLoading={isLoading}
              currentTopic={currentTopic}
              onImageAnalyzed={handleImageAnalysis}
            />
          </motion.div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full filter blur-[100px] opacity-50 -translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/30 rounded-full filter blur-[100px] opacity-50 translate-x-1/2 translate-y-1/2" />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;