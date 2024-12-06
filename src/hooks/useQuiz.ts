import { useState } from "react";
import { QuizState, QuizQuestion } from "@/types/quiz";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import confetti from "canvas-confetti";

export const useQuiz = (updateUserProgress: (points: number) => Promise<void>) => {
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    currentQuestion: null,
    blocksExplored: 0,
    currentTopic: ""
  });
  const { toast } = useToast();

  const generateQuizQuestion = async (topic: string) => {
    try {
      const { data: quizData, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic }
      });

      if (error) throw error;

      setQuizState(prev => ({
        ...prev,
        isActive: true,
        currentQuestion: quizData.question
      }));
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate a quiz right now. Let's keep exploring!",
        variant: "destructive"
      });
    }
  };

  const handleQuizAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      await updateUserProgress(10);
      
      toast({
        title: "🎉 Awesome!",
        description: "You've earned 10 points for your correct answer!",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Not quite!",
        description: "Keep exploring to learn more!",
        className: "bg-primary text-white",
      });
    }

    setQuizState(prev => ({
      ...prev,
      isActive: false,
      currentQuestion: null,
      blocksExplored: 0
    }));
  };

  const updateBlocksExplored = (topic: string) => {
    setQuizState(prev => {
      const newBlocksExplored = prev.currentTopic === topic ? prev.blocksExplored + 1 : 1;
      const shouldTriggerQuiz = newBlocksExplored >= 4;
      
      if (shouldTriggerQuiz) {
        generateQuizQuestion(topic);
      }
      
      return {
        ...prev,
        blocksExplored: newBlocksExplored,
        currentTopic: topic
      };
    });
  };

  return {
    quizState,
    handleQuizAnswer,
    updateBlocksExplored
  };
};