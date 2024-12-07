import { useState, useCallback } from "react";
import { useQuiz } from "./useQuiz";
import { useUserProgress } from "./useUserProgress";
import { Block } from "@/types/chat";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useAuth } from "./useAuth";

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const { isAuthenticated } = useAuth();
  const { userProgress, updateUserProgress } = useUserProgress();
  const { quizState, handleQuizAnswer } = useQuiz({ updateProgress: updateUserProgress });
  const { generateDynamicBlocks } = useBlockGeneration();
  const { handleImageAnalysis } = useImageAnalysis();

  const handleListen = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleBlockClick = useCallback(async (block: Block) => {
    setCurrentTopic(block.metadata.topic);
    setMessages(prev => [...prev, {
      text: `Tell me about ${block.title}`,
      isAi: false
    }]);
    
    setIsLoading(true);
    try {
      const response = await generateDynamicBlocks(block.title, block.metadata.topic);
      setMessages(prev => [...prev, {
        text: response.message,
        isAi: true,
        blocks: response.blocks
      }]);
    } catch (error) {
      console.error('Error handling block click:', error);
    } finally {
      setIsLoading(false);
    }
  }, [generateDynamicBlocks]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { text: message, isAi: false }]);
    setIsLoading(true);

    try {
      const response = await generateDynamicBlocks(message, currentTopic);
      setMessages(prev => [...prev, {
        text: response.message,
        isAi: true,
        blocks: response.blocks
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTopic, generateDynamicBlocks, isLoading]);

  const handleImageAnalysis = useCallback(async (imageData: string) => {
    setIsLoading(true);
    try {
      const response = await handleImageAnalysis(imageData);
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
  }, [handleImageAnalysis]);

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