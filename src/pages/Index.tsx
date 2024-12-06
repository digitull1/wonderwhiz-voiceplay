import React, { useState, useEffect } from "react";
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
  const [currentTopic, setCurrentTopic] = useState("space");
  const { toast } = useToast();

  const detectTopic = (message: string) => {
    const topics = {
      space: ["space", "planet", "star", "galaxy", "astronaut", "rocket", "alien"],
      biology: ["body", "cell", "dna", "brain", "heart", "animal", "plant"],
      earth: ["earth", "volcano", "ocean", "mountain", "weather", "dinosaur"],
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return topic;
      }
    }
    return currentTopic;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isAi: true }]);
      setCurrentTopic(detectTopic(userMessage));
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: string) => {
    const topicQuestions = {
      black_hole_interior: "What's inside a black hole?",
      alien_life: "Are there aliens in space?",
      stellar_death: "How do stars die?",
      // Add more mappings as needed
    };

    const question = topicQuestions[topic as keyof typeof topicQuestions] || `Tell me about ${topic.replace(/_/g, " ")}`;
    setInput(question);
    await handleSend();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 h-[calc(100vh-4rem)] flex flex-col">
          <ApiKeyInput />
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isAi={message.isAi}
                onListen={message.isAi ? handleListen : undefined}
              />
            ))}
          </div>
          
          <div className="space-y-6">
            <TopicBlocks currentTopic={currentTopic} onTopicSelect={handleTopicSelect} />
            
            <div className="flex gap-2">
              <Input
                placeholder={isLoading ? "Thinking..." : "Ask me anything about " + currentTopic + "..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <VoiceInput onVoiceInput={handleVoiceInput} />
              <Button onClick={handleSend} disabled={isLoading} className="bg-primary hover:bg-primary/90">
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