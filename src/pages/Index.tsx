import React, { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { TopicBlocks } from "@/components/TopicBlocks";
import { VoiceInput } from "@/components/VoiceInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Wonder Whiz, your learning buddy! What would you like to explore today?",
      isAi: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("general");
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isAi: true }]);
      
      // Update current topic based on user's message
      if (userMessage.toLowerCase().includes("space")) setCurrentTopic("space");
      else if (userMessage.toLowerCase().includes("dna") || userMessage.toLowerCase().includes("life")) setCurrentTopic("biology");
      else if (userMessage.toLowerCase().includes("earth") || userMessage.toLowerCase().includes("volcano")) setCurrentTopic("earth");
      
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
  };

  const handleListen = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].text);
    synth.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-4rem)] flex flex-col">
          <ApiKeyInput />
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
            <TopicBlocks currentTopic={currentTopic} />
            
            <div className="flex gap-2">
              <Input
                placeholder={isLoading ? "Getting response..." : "Ask me anything..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <VoiceInput onVoiceInput={handleVoiceInput} />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;