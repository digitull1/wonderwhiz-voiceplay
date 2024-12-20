import { useState, useCallback, useEffect } from "react";
import { useQuiz } from "./useQuiz";
import { useUserProgress } from "./useUserProgress";
import { Block } from "@/types/chat";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useAuth } from "./useAuth";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
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
  const { toast } = useToast();

  // Initialize chat based on auth state
  useEffect(() => {
    const initializeChat = async () => {
      if (isAuthenticated) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            const blocks = await generateDynamicBlocks("welcome", "general");
            const welcomeMessage = {
              text: `Welcome back${profile.name ? `, ${profile.name}` : ''}! 🌟 What would you like to learn about today?`,
              isAi: true,
              blocks
            };
            setMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
          toast({
            title: "Error",
            description: "Could not load your chat. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      } else {
        setMessages([{
          text: "Hi! I'm WonderWhiz! Your friendly AI Assistant! Please login or register to continue 😊",
          isAi: true,
          showAuthPrompt: true
        }]);
      }
    };

    initializeChat();
  }, [isAuthenticated]);

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
      const blocks = await generateDynamicBlocks(response, currentTopic || "general");
      
      setMessages(prev => [...prev, {
        text: response,
        isAi: true,
        blocks
      }]);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [analyzeImage, generateDynamicBlocks, currentTopic]);

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
