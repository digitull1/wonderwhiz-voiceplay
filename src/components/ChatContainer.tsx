import React from "react";
import { ChatMessage } from "./ChatMessage";
import { motion } from "framer-motion";

interface ChatContainerProps {
  messages: Array<{ text: string; isAi: boolean }>;
  handleListen: () => void;
}

export const ChatContainer = ({ messages, handleListen }: ChatContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.text}
          isAi={message.isAi}
          onListen={message.isAi ? handleListen : undefined}
        />
      ))}
    </div>
  );
};