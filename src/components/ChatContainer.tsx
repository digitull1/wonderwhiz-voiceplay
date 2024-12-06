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
  handleListen: () => void;
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
      const scrollThreshold = 300; // pixels from bottom
      
      // Only auto-scroll if user is already near bottom or if it's a new AI message
      const shouldScroll = scrollHeight - currentScroll - clientHeight < scrollThreshold ||
                          (messages.length > 0 && messages[messages.length - 1].isAi);
      
      if (shouldScroll) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "end"
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, quizState?.currentQuestion]);

  // Filter out messages that are just block titles
  const filteredMessages = messages.filter((message, index) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return !(prevMessage && !prevMessage.isAi && message.text.startsWith('Tell me about'));
  });

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent"
    >
      {filteredMessages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.text}
          isAi={message.isAi}
          onListen={message.isAi ? handleListen : undefined}
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