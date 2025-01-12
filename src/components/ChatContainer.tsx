import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { Block, QuizState } from "@/types/chat";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
  showAuthPrompt?: boolean;
  imageUrl?: string;
  quizState?: QuizState;
}

interface ChatContainerProps {
  messages: Message[];
  handleListen: (text: string) => void;
  onBlockClick?: (block: Block) => void;
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onQuizGenerated?: (quiz: any) => void;
  onAuthPromptClick?: () => void;
  onPanelOpen?: () => void;
  onImageAnalyzed?: (response: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  handleListen, 
  onBlockClick,
  quizState,
  onQuizAnswer,
  onQuizGenerated,
  onAuthPromptClick,
  onPanelOpen,
  onImageAnalyzed
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const scrollHeight = container.scrollHeight;
      const currentScroll = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollThreshold = 100;
      
      const shouldScroll = 
        scrollHeight - currentScroll - clientHeight < scrollThreshold ||
        (messages.length > 0 && messages[messages.length - 1].isAi);
      
      if (shouldScroll) {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end"
        });
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, quizState?.currentQuestion]);

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto chat-container",
        "pb-[80px] md:pb-[100px]" // Account for fixed chat input
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ChatMessage
              message={message.text}
              isAi={message.isAi}
              onListen={() => handleListen(message.text)}
              blocks={message.blocks}
              onBlockClick={onBlockClick}
              imageUrl={message.imageUrl}
              quizState={message.quizState}
              onQuizAnswer={onQuizAnswer}
              onQuizGenerated={onQuizGenerated}
              messageIndex={index}
              onPanelOpen={onPanelOpen}
              onImageAnalyzed={onImageAnalyzed}
            />
            {message.showAuthPrompt && (
              <motion.div 
                className="flex justify-center gap-2 my-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={onAuthPromptClick}
                  className="bg-gradient-to-r from-primary via-secondary to-accent 
                    text-white font-medium px-8 py-3 rounded-xl shadow-xl
                    hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Sign Up / Log In
                </Button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} className="h-4" />
    </motion.div>
  );
};