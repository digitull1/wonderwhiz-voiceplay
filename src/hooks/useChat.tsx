import { useState } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/hooks/use-toast";
import { Message, UserProfile, Block } from "@/types/chat";
import { handleNameInput, handleAgeInput } from "@/utils/profileUtils";
import { useUserProgress } from "./useUserProgress";
import { useBlockGeneration } from "./useBlockGeneration";
import { useImageAnalysis } from "./useImageAnalysis";
import { useQuiz } from "./useQuiz";
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
  const { userProgress, updateUserProgress } = useUserProgress();
  const { generateDynamicBlocks } = useBlockGeneration(userProfile);
  const { handleImageAnalysis, isAnalyzing } = useImageAnalysis();
  const { quizState, handleQuizAnswer, updateBlocksExplored } = useQuiz(updateUserProgress);

  const getPointsForAction = (action: string): number => {
    switch (action) {
      case 'question': return 5;  // Basic question
      case 'image_upload': return 15;  // Image analysis
      case 'block_exploration': return 10;  // Clicking on a block
      case 'long_conversation': return 8;  // Multiple messages in a row
      default: return 5;
    }
  };

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
      // Track learning time
      const today = new Date().toISOString().split('T')[0];
      const { data: existingTime } = await supabase
        .from('learning_time')
        .select('*')
        .eq('date', today)
        .single();

      if (existingTime) {
        await supabase
          .from('learning_time')
          .update({ 
            minutes_spent: (existingTime.minutes_spent || 0) + 1 
          })
          .eq('id', existingTime.id);
      } else {
        await supabase
          .from('learning_time')
          .insert([{ 
            minutes_spent: 1,
            date: today
          }]);
      }

      const previousMessages = messages.slice(-3).map(m => m.text).join(" ");
      const response = await getGroqResponse(messageText);
      const blocks = await generateDynamicBlocks(response, currentTopic, previousMessages);
      
      setMessages(prev => [...prev, { 
        text: response, 
        isAi: true, 
        blocks 
      }]);
      
      const points = getPointsForAction(
        messages.length > 3 ? 'long_conversation' : 'question'
      );
      await updateUserProgress(points);
      
      toast({
        title: "Points Earned! ⭐",
        description: `You've earned ${points} points for exploring and learning!`,
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

  const handleBlockClick = async (block: Block) => {
    const topic = block?.metadata?.topic || currentTopic;
    console.log('Block clicked:', block);
    setCurrentTopic(topic);
    updateBlocksExplored(topic);
    
    await updateUserProgress(getPointsForAction('block_exploration'));
    
    toast({
      title: "Great exploring! 🚀",
      description: `You've earned ${getPointsForAction('block_exploration')} points for your curiosity!`,
      className: "bg-secondary text-white",
    });
    
    await sendMessage(`Tell me about "${block?.title || 'this topic'}"`, true);
  };

  const handleImageUploadSuccess = async (response: string) => {
    if (response) {
      await updateUserProgress(getPointsForAction('image_upload'));
      
      toast({
        title: "Image analyzed! 🎨",
        description: `You've earned ${getPointsForAction('image_upload')} points for sharing an image!`,
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
