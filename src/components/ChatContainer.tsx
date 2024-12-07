import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { QuizCard } from "./quiz/QuizCard";
import { Block, QuizState } from "@/types/chat";

interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
}

interface ChatContainerProps {
  messages: Message[];
  handleListen: (text: string) => void;  // Updated type definition
  onBlockClick?: (block: Block) => void;
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
}

export const ChatContainer = ({ 
  messages, 
  handleListen, 
  onBlockClick,
  quizState,
  onQuizAnswer 
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="flex-1 overflow-y-auto space-y-3 mb-4 px-2 chat-container"
    >
      {filteredMessages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.text}
          isAi={message.isAi}
          onListen={() => handleListen(message.text)}
          blocks={message.blocks}
          onBlockClick={onBlockClick}
        />
      ))}
      
      {quizState?.isActive && quizState.currentQuestion && (
        <QuizCard
          question={quizState.currentQuestion}
          onAnswer={onQuizAnswer || (() => {})}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};