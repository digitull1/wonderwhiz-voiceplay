import { useState, useEffect } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { Message, UserProfile, Block } from "@/types/chat";
import { useBlockGeneration } from "./useBlockGeneration";
import { useUserProgress } from "./useUserProgress";
import { supabase } from "@/integrations/supabase/client";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! 👋 I'm Wonder Whiz, your learning buddy! What's your name? 🌟",
      isAi: true,
      blocks: []
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("space");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const { generateDynamicBlocks } = useBlockGeneration(userProfile);
  const { userProgress, updateUserProgress } = useUserProgress();

  const handleNameInput = (name: string) => {
    setUserProfile(prev => ({ ...prev, name } as UserProfile));
    setMessages(prev => [
      ...prev,
      { text: name, isAi: false },
      { 
        text: `Awesome, ${name}! How old are you? This helps me tailor everything just for you! 🎯`, 
        isAi: true,
        blocks: []
      }
    ]);
  };

  const handleAgeInput = async (age: number) => {
    setUserProfile(prev => ({ ...prev, age } as UserProfile));
    setMessages(prev => [
      ...prev,
      { text: age.toString(), isAi: false }
    ]);

    try {
      const welcomeResponse = `Welcome to WonderWhiz! Let's explore amazing topics together!`;
      const blocks = await generateDynamicBlocks(welcomeResponse, "welcome");
      
      setMessages(prev => [...prev, {
        text: `Great to meet you${userProfile?.name ? `, ${userProfile.name}` : ''}! I'll make sure to make our learning adventure perfect for a ${age} year old explorer! What would you like to learn about? 🚀`,
        isAi: true,
        blocks: blocks
      }]);

      // Award points for completing profile
      await updateUserProgress(10);
      
      toast({
        title: "Profile Complete! 🎉",
        description: "You've earned 10 points for starting your journey!",
        className: "bg-primary text-white",
      });
    } catch (error) {
      console.error('Error generating welcome blocks:', error);
      toast({
        title: "Oops!",
        description: "Had trouble generating topics. Try again!",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    if (!userProfile?.name) {
      handleNameInput(messageText);
      return;
    }

    if (!userProfile?.age) {
      const age = parseInt(messageText);
      if (isNaN(age) || age < 5 || age > 16) {
        setMessages(prev => [
          ...prev,
          { text: messageText, isAi: false },
          { text: "Please enter a valid age between 5 and 16! 🎈", isAi: true, blocks: [] }
        ]);
        return;
      }
      await handleAgeInput(age);
      return;
    }

    setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message:", messageText);
      const response = await getGroqResponse(messageText);
      console.log("Received response:", response);
      
      const blocks = await generateDynamicBlocks(response, currentTopic);
      console.log("Generated blocks:", blocks);
      
      const aiMessage = { 
        text: response, 
        isAi: true, 
        blocks: blocks 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Award points for interaction
      await updateUserProgress(5);
      
      toast({
        title: "Points Earned! 🌟",
        description: "You've earned 5 points for exploring and learning!",
        className: "bg-primary text-white",
      });
      
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

  const handleImageAnalysis = (response: string) => {
    setMessages(prev => [
      ...prev,
      { text: "I uploaded an image! 📸", isAi: false },
      { text: response, isAi: true }
    ]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    userProgress,
    handleListen: () => {}, // Placeholder for voice feature
    handleBlockClick: (block: Block) => {
      setCurrentTopic(block.metadata.topic);
      sendMessage(`Tell me about ${block.title}!`);
    },
    sendMessage,
    handleImageAnalysis
  };
};