import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { QuizCard } from "./quiz/QuizCard";
import { Block, QuizState } from "@/types/chat";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
  showAuthPrompt?: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  handleListen: (text: string) => void;
  onBlockClick?: (block: Block) => void;
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onAuthPromptClick?: () => void;
}

export const ChatContainer = ({ 
  messages, 
  handleListen, 
  onBlockClick,
  quizState,
  onQuizAnswer,
  onAuthPromptClick
}: ChatContainerProps) => {
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

  const filteredMessages = messages.filter((message, index) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return !(prevMessage && !prevMessage.isAi && message.text.startsWith('Tell me about'));
  });

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto space-y-3 chat-container",
        "pb-[80px] md:pb-[100px]", // Account for fixed chat input
        isMobile ? "px-2" : "px-4"
      )}
    >
      {filteredMessages.map((message, index) => (
        <React.Fragment key={index}>
          <ChatMessage
            message={message.text}
            isAi={message.isAi}
            onListen={() => handleListen(message.text)}
            blocks={message.blocks}
            onBlockClick={onBlockClick}
          />
          {message.showAuthPrompt && (
            <div className="flex justify-center gap-2 my-2">
              <Button 
                onClick={onAuthPromptClick}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Sign Up / Log In
              </Button>
            </div>
          )}
        </React.Fragment>
      ))}
      
      {quizState?.isActive && quizState.currentQuestion && (
        <QuizCard
          question={quizState.currentQuestion}
          onAnswer={onQuizAnswer || (() => {})}
        />
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};