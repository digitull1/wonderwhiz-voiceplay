import { useState, useEffect } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/hooks/use-toast";
import { Message, Block } from "@/types/chat";
import { useUserProgress } from "./useUserProgress";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useQuiz } from "./useQuiz";
import { useBlockInteractions } from "./useBlockInteractions";
import { useAuth } from "./useAuth";

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
  const { userProgress, updateUserProgress } = useUserProgress(tempUserId);
  const { generateDynamicBlocks } = useBlockGeneration();
  const { handleImageAnalysis, isAnalyzing } = useImageAnalysis();
  const { quizState, handleQuizAnswer, updateBlocksExplored } = useQuiz(updateUserProgress);

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
      
      if (isAuthenticated || tempUserId) {
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
    console.log('Speaking text:', text);
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUploadSuccess = async (response: string) => {
    if (response) {
      if (isAuthenticated || tempUserId) {
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