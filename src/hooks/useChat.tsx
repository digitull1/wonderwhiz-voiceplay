import { useState } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { Message, UserProfile, Block } from "@/types/chat";
import { handleNameInput, handleAgeInput } from "@/utils/profileUtils";
import { useUserProgress } from "./useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { useBlockGeneration } from "./useBlockGeneration";

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
  const { userProgress, updateUserProgress } = useUserProgress();
  const { generateDynamicBlocks } = useBlockGeneration(userProfile);

  const sendMessage = async (messageText: string) => {
    console.log("Sending message:", messageText);
    if (!messageText.trim() || isLoading) return;
    
    if (!userProfile?.name) {
      handleNameInput(messageText, setUserProfile, setMessages);
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
      await handleAgeInput(age, setUserProfile, setMessages, async (points: number) => {
        await updateUserProgress(points);
      });
      return;
    }

    // Add user message to chat
    setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Getting Groq response for:", messageText);
      const response = await getGroqResponse(messageText);
      console.log("Received Groq response:", response);
      
      if (!response) {
        throw new Error("No response received from Groq");
      }

      const blocks = await generateDynamicBlocks(response, currentTopic);
      console.log("Generated blocks:", blocks);
      
      const aiMessage = { 
        text: response, 
        isAi: true, 
        blocks: blocks 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update user progress with points
      const pointsToAdd = 5;
      const updatedProgress = await updateUserProgress(pointsToAdd);
      
      if (updatedProgress) {
        toast({
          title: "Points Earned! 🌟",
          description: `You've earned ${pointsToAdd} points for exploring and learning!`,
          className: "bg-primary text-white",
        });
      }
      
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "Oops! I had a little hiccup. Let's try that again! 🎈", 
          isAi: true, 
          blocks: [] 
        }
      ]);
      
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockClick = async (block: Block) => {
    console.log("Block clicked:", block);
    setCurrentTopic(block.metadata.topic);
    const prompt = `Tell me about "${block.title}": ${block.description}`;
    await sendMessage(prompt);
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
    handleBlockClick,
    sendMessage,
    handleImageAnalysis
  };
};
