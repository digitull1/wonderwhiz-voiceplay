import React, { useState } from "react";
import { TopicBlocks } from "@/components/TopicBlocks";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";

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

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqResponse(messageText);
      setMessages(prev => [...prev, { text: response, isAi: true }]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleTopicSelect = async (topic: string) => {
    setCurrentTopic(topic);
    const topicPrompts: { [key: string]: string } = {
      black_hole_interior: "Can you explain what's inside a black hole in a way that's easy for kids to understand?",
      alien_life: "Tell me about the possibility of finding alien life in space!",
      stellar_death: "What happens when stars die? Tell me the exciting story!",
      dna_secrets: "What's DNA and why is it so important for our bodies?",
      dream_science: "Why do we dream when we sleep? What's happening in our brains?",
      brain_function: "How does our brain work to help us think and remember things?",
      volcano_secrets: "What makes volcanoes erupt and why are they so fascinating?",
      ocean_exploration: "What amazing creatures live in the deep ocean?",
      dinosaur_era: "Tell me about the most interesting dinosaurs that lived on Earth!"
    };

    const prompt = topicPrompts[topic] || `Tell me something fascinating about ${topic.replace(/_/g, " ")}!`;
    await sendMessage(prompt);
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
  };

  const handleListen = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].text);
    synth.speak(utterance);
  };

  const getLastAiMessage = () => {
    const reversedMessages = [...messages].reverse();
    const lastAiMessage = reversedMessages.find(msg => msg.isAi);
    return lastAiMessage?.text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-[calc(100vh-4rem)] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChatHeader />
          <ChatContainer messages={messages} handleListen={handleListen} />
          <div className="space-y-6">
            <TopicBlocks 
              currentTopic={currentTopic} 
              onTopicSelect={handleTopicSelect}
              lastMessage={getLastAiMessage()}
            />
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleVoiceInput={handleVoiceInput}
              isLoading={isLoading}
              currentTopic={currentTopic}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;