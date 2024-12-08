import { useState, useCallback, useEffect } from "react";
import { useQuiz } from "./useQuiz";
import { useUserProgress } from "./useUserProgress";
import { Block } from "@/types/chat";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useAuth } from "./useAuth";
import { getGroqResponse } from "@/utils/groq";

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([{
    text: "Hi! I'm WonderWhiz! Your friendly AI Assistant! Please login or register to continue 😊",
    isAi: true,
    showAuthPrompt: true
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [blocksExplored, setBlocksExplored] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const { userProgress, updateUserProgress } = useUserProgress();
  const { quizState, handleQuizAnswer, updateBlocksExplored } = useQuiz({ updateProgress: updateUserProgress });
  const { generateDynamicBlocks } = useBlockGeneration(null);
  const { handleImageAnalysis: analyzeImage } = useImageAnalysis();

  // Add event listener for new messages
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      console.log('New message event received:', event.detail);
      setMessages(prev => [...prev, event.detail]);
    };

    window.addEventListener('wonderwhiz:newMessage', handleNewMessage as EventListener);
    return () => {
      window.removeEventListener('wonderwhiz:newMessage', handleNewMessage as EventListener);
    };
  }, []);

  const handleListen = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleBlockClick = useCallback(async (block: Block) => {
    setCurrentTopic(block.metadata.topic);
    setIsLoading(true);
    
    try {
      const detailedContent = await getGroqResponse(block.title, 100);
      const blocks = await generateDynamicBlocks(block.title, block.metadata.topic);
      
      setMessages(prev => [...prev, {
        text: detailedContent,
        isAi: true,
        blocks
      }]);

      setBlocksExplored(prev => {
        const newCount = prev + 1;
        if (newCount >= 4) {
          updateBlocksExplored(block.metadata.topic);
          return 0;
        }
        return newCount;
      });
    } catch (error) {
      console.error('Error handling block click:', error);
    } finally {
      setIsLoading(false);
    }
  }, [generateDynamicBlocks, updateBlocksExplored]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { text: message, isAi: false }]);
    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      const detailedContent = await getGroqResponse(message, 100);
      const blocks = await generateDynamicBlocks(message, message);
      
      setMessages(prev => [...prev, {
        text: detailedContent,
        isAi: true,
        blocks
      }]);

      setBlocksExplored(prev => {
        const newCount = prev + 1;
        if (newCount >= 4) {
          updateBlocksExplored(currentTopic || "general");
          return 0;
        }
        return newCount;
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTopic, generateDynamicBlocks, isLoading, isAuthenticated, updateBlocksExplored]);

  const handleImageAnalysis = useCallback(async (imageData: string) => {
    setIsLoading(true);
    try {
      const response = await analyzeImage(imageData);
      setMessages(prev => [...prev, {
        text: response,
        isAi: true,
        blocks: []
      }]);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [analyzeImage]);

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
    handleImageAnalysis,
    isAuthenticated
  };
};
