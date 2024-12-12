import React, { useState, useEffect } from "react";
import { Block, QuizState } from "@/types/chat";
import { MessageContainer } from "./chat/MessageContainer";
import { MessageHeader } from "./chat/MessageHeader";
import { MessageBody } from "./chat/MessageBody";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: (text: string) => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
  onQuizGenerated?: (quiz: any) => void;
  onPanelOpen?: () => void;
  imageUrl?: string;
  quizState?: QuizState;
  onQuizAnswer?: (isCorrect: boolean) => void;
  messageIndex?: number;
  onImageAnalyzed?: (response: string) => void;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  isAi = false, 
  message, 
  onListen,
  blocks = [],
  onBlockClick,
  onQuizGenerated,
  onPanelOpen,
  imageUrl,
  quizState,
  onQuizAnswer,
  messageIndex = 0,
  onImageAnalyzed,
  isLoading
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const showActions = !isAi || messageIndex > 3;

  useEffect(() => {
    if (isAi && message) {
      setIsTyping(true);
      setShowBlocks(false);
      
      setTimeout(() => {
        setIsTyping(false);
        setShowBlocks(true);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 2000);
      }, 500);
    }
  }, [message, isAi]);

  const handleTypingComplete = () => {
    setIsTyping(false);
    setTimeout(() => {
      setShowBlocks(true);
    }, 500);
  };

  // Debug logs
  console.log('ChatMessage rendered with:', {
    isAi,
    hasBlocks: blocks?.length > 0,
    blocksCount: blocks?.length,
    showBlocks,
    isTyping
  });

  return (
    <MessageContainer isAi={isAi} showReward={showReward}>
      <MessageHeader isAi={isAi} isTyping={isTyping} />
      <MessageBody
        isAi={isAi}
        message={message}
        onListen={onListen}
        blocks={blocks}
        onBlockClick={onBlockClick}
        onQuizGenerated={onQuizGenerated}
        onPanelOpen={onPanelOpen}
        imageUrl={imageUrl}
        quizState={quizState}
        onQuizAnswer={onQuizAnswer}
        messageIndex={messageIndex}
        onImageAnalyzed={onImageAnalyzed}
        isLoading={isLoading}
        isTyping={isTyping}
        showBlocks={showBlocks}
        showActions={showActions}
        onTypingComplete={handleTypingComplete}
      />
    </MessageContainer>
  );
};

export default React.memo(ChatMessage);