import React from "react";
import { ChatMessage } from "./ChatMessage";
import { motion } from "framer-motion";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
}

interface ChatContainerProps {
  messages: Message[];
  handleListen: () => void;
  onBlockClick?: (block: Block) => void;
}

export const ChatContainer = ({ messages, handleListen, onBlockClick }: ChatContainerProps) => {
  // Filter out messages that are just block titles
  const filteredMessages = messages.filter((message, index) => {
    if (index === 0) return true; // Always keep the first message
    const prevMessage = messages[index - 1];
    // Skip messages that are just repeating block titles
    return !(prevMessage && !prevMessage.isAi && message.text.startsWith('Tell me about'));
  });

  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
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
    </div>
  );
};