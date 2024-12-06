import React, { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { TopicBlocks } from "@/components/TopicBlocks";
import { VoiceInput } from "@/components/VoiceInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Wonder Whiz, your learning buddy! What would you like to explore today?",
      isAi: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isAi: false }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "That's a great question! Let me help you learn about that. What specific aspect would you like to explore?",
          isAi: true,
        },
      ]);
    }, 1000);
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
  };

  const handleListen = () => {
    // Implement text-to-speech here
    console.log("Listen clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-4rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isAi={message.isAi}
                onListen={message.isAi ? handleListen : undefined}
              />
            ))}
          </div>
          
          <div className="space-y-4">
            <TopicBlocks />
            
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <VoiceInput onVoiceInput={handleVoiceInput} />
              <Button onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;