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
    text: "Hi! I'm WonderWhiz! What's your name? 😊",
    isAi: true
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
      const detailedContent = await getGroqResponse(block.title, 100);
      const blocks = await generateDynamicBlocks(block.title, block.metadata.topic);
      
      setMessages(prev => [...prev, {
        text: `Let me tell you about ${block.title}! 🌟\n\n${detailedContent}`,
        isAi: true,
        blocks
      }]);

      setBlocksExplored(prev => prev + 1);
      if (blocksExplored >= 3) {
        updateBlocksExplored(block.metadata.topic);
        setBlocksExplored(0);
      }
    } catch (error) {
      console.error('Error handling block click:', error);
    } finally {
      setIsLoading(false);
    }
  }, [generateDynamicBlocks, blocksExplored, updateBlocksExplored]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { text: message, isAi: false }]);
    setIsLoading(true);

    try {
      // Handle initial name input
      if (!userName) {
        setUserName(message);
        setMessages(prev => [...prev, {
          text: `Nice to meet you, ${message}! How old are you? This helps me make our chats perfect for you! 🎯`,
          isAi: true
        }]);
        setIsLoading(false);
        return;
      }

      // Handle age input
      if (!userAge && userName) {
        const age = parseInt(message);
        if (isNaN(age) || age < 4 || age > 12) {
          setMessages(prev => [...prev, {
            text: "Oops! Please tell me your age as a number between 4 and 12! 🎈",
            isAi: true
          }]);
          setIsLoading(false);
          return;
        }
        setUserAge(age);
        const blocks = await generateDynamicBlocks("Welcome topics for kids", "general");
        setMessages(prev => [...prev, {
          text: `Awesome! ${age} is a perfect age for amazing discoveries! 🌟 I've got some mind-blowing facts that will blow your socks off! Check these out and click on what interests you the most! 🚀`,
          isAi: true,
          blocks
        }]);
        setIsLoading(false);
        return;
      }

      // Handle regular chat messages
      const detailedContent = await getGroqResponse(message, 100);
      const blocks = await generateDynamicBlocks(message, currentTopic || "general");
      
      setMessages(prev => [...prev, {
        text: `${detailedContent} 🌟`,
        isAi: true,
        blocks
      }]);

      setBlocksExplored(prev => prev + 1);
      if (blocksExplored >= 3) {
        updateBlocksExplored(currentTopic || "general");
        setBlocksExplored(0);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTopic, generateDynamicBlocks, isLoading, userName, userAge, blocksExplored, updateBlocksExplored]);

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