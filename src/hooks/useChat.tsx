import { useState, useEffect } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";
import { useUserProgress } from "./useUserProgress";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useQuiz } from "./useQuiz";
import { useBlockInteractions } from "./useBlockInteractions";
import { useAuth } from "./useAuth";
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
  
  const { toast } = useToast();
  const { isAuthenticated, tempUserId } = useAuth();
  const { userProgress, updateUserProgress } = useUserProgress(tempUserId || "temp");
  const { generateDynamicBlocks } = useBlockGeneration();
  const { handleImageAnalysis, isAnalyzing } = useImageAnalysis();
  const { quizState, handleQuizAnswer, updateBlocksExplored } = useQuiz({
    updateProgress: updateUserProgress
  });

  const sendMessage = async (messageText: string, skipUserMessage: boolean = false) => {
    if (!messageText.trim() || isLoading) return;
    
    if (!skipUserMessage) {
      setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    }
    setInput("");
    setIsLoading(true);

    try {
      const previousMessages = messages.slice(-3).map(m => m.text).join(" ");
      const response = await getGroqResponse(messageText, 100);
      console.log('Received response:', response);
      
      const blocks = await generateDynamicBlocks(response, "space", previousMessages);
      console.log('Generated blocks:', blocks);
      
      setMessages(prev => [...prev, { 
        text: response, 
        isAi: true, 
        blocks 
      }]);
      
      if (isAuthenticated) {
        await updateUserProgress(5);
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

  const handleListen = (text: string) => {
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    toast({
      title: "🎙️ Speaking...",
      description: "Click again to stop",
    });
  };

  const handleImageUploadSuccess = async (response: string) => {
    if (response) {
      if (isAuthenticated) {
        await updateUserProgress(15);
        
        toast({
          title: "Image analyzed! 🎨",
          description: "You've earned 15 points for sharing an image!",
          className: "bg-accent text-white",
        });
      }
      
      setMessages(prev => [...prev, { 
        text: response, 
        isAi: true,
        blocks: [] 
      }]);
    }
  };

  const { currentTopic, handleBlockClick } = useBlockInteractions(
    updateUserProgress,
    updateBlocksExplored,
    sendMessage
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    userProgress,
    handleListen,
    handleBlockClick,
    handleQuizAnswer,
    quizState,
    sendMessage,
    handleImageAnalysis: handleImageUploadSuccess,
    isAnalyzing,
    isAuthenticated
  };
};