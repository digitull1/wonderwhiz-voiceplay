import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { Block, QuizState } from "@/types/chat";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    console.log('Messages in ChatContainer:', messages);
    messages.forEach((msg, index) => {
      if (msg.blocks) {
        console.log(`Message ${index} blocks:`, msg.blocks);
      }
    });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          Loading your chat...
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto space-y-3 chat-container w-full",
        "pb-[80px] md:pb-[100px]", // Account for fixed chat input
        isMobile ? "px-2" : "px-4"
      )}
    >
      {messages.map((message, index) => {
        console.log(`Rendering message ${index}:`, {
          text: message.text,
          isAi: message.isAi,
          hasBlocks: !!message.blocks,
          blockCount: message.blocks?.length
        });
        
        return (
          <React.Fragment key={index}>
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
        );
      })}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};