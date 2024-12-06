import React from "react";
import { Button } from "./ui/button";
import { Mic, Volume2 } from "lucide-react";

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isAi, message, onListen }) => {
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}>
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isAi
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <p className="text-sm md:text-base">{message}</p>
        {isAi && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-primary-foreground hover:text-primary-foreground/80"
            onClick={onListen}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
        )}
      </div>
    </div>
  );
};