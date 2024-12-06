import React from "react";
import { motion } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-[calc(100vh-4rem)] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
    </div>
  );
};

export default Index;