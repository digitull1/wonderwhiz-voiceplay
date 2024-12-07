import { useState } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/hooks/use-toast";
import { Message, UserProfile, Block } from "@/types/chat";
import { handleNameInput, handleAgeInput } from "@/utils/profileUtils";
import { useUserProgress } from "./useUserProgress";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useQuiz } from "./useQuiz";
import { useBlockInteractions } from "./useBlockInteractions";
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const { toast } = useToast();
  const { userProgress, updateUserProgress } = useUserProgress();
  const { generateDynamicBlocks } = useBlockGeneration(userProfile);
  const { handleImageAnalysis, isAnalyzing } = useImageAnalysis();
  const { quizState, handleQuizAnswer, updateBlocksExplored } = useQuiz(updateUserProgress);

  const sendMessage = async (messageText: string, skipUserMessage: boolean = false) => {
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
      await handleAgeInput(age, setUserProfile, setMessages, updateUserProgress);
      return;
    }

    if (!skipUserMessage) {
      setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    }
    setInput("");
    setIsLoading(true);

    try {
      const previousMessages = messages.slice(-3).map(m => m.text).join(" ");
      const response = await getGroqResponse(messageText);
      const blocks = await generateDynamicBlocks(response, currentTopic, previousMessages);
      
      setMessages(prev => [...prev, { 
        text: response, 
        isAi: true, 
        blocks 
      }]);
      
      await updateUserProgress(5);
      
      toast({
        title: "Points Earned! ⭐",
        description: "You've earned 5 points for exploring and learning!",
        className: "bg-primary text-white",
      });
      
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

  const { currentTopic, handleBlockClick } = useBlockInteractions(
    updateUserProgress,
    updateBlocksExplored,
    sendMessage
  );

  const handleImageUploadSuccess = async (response: string) => {
    if (response) {
      await updateUserProgress(15);
      
      toast({
        title: "Image analyzed! 🎨",
        description: "You've earned 15 points for sharing an image!",
        className: "bg-accent text-white",
      });
      
      setMessages(prev => [...prev, { 
        text: response, 
        isAi: true,
        blocks: [] 
      }]);
    }
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
    handleQuizAnswer,
    quizState,
    sendMessage,
    handleImageAnalysis: handleImageUploadSuccess,
    isAnalyzing
  };
};
