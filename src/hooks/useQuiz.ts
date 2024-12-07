import { useState } from "react";
import { QuizState, QuizQuestion } from "@/types/quiz";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import confetti from "canvas-confetti";

interface UseQuizProps {
  updateProgress: (points: number) => Promise<void>;
}

export const useQuiz = ({ updateProgress }: UseQuizProps) => {
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    currentQuestion: null,
    blocksExplored: 0,
    currentTopic: ""
  });
  const { toast } = useToast();

  const generateQuizQuestion = async (topic: string) => {
    try {
      console.log('Generating quiz for topic:', topic);
      const { data: quizData, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic }
      });

      if (error) {
        console.error('Error generating quiz:', error);
        throw error;
      }

      console.log('Quiz data received:', quizData);
      
      if (!quizData?.question) {
        throw new Error('Invalid quiz data received');
      }

      setQuizState(prev => ({
        ...prev,
        isActive: true,
        currentQuestion: quizData.question
      }));

      toast({
        title: "🎯 Quiz Time!",
        description: "Let's test what you've learned!",
      });
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
      
      await updateProgress(10);
      
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
    console.log('Updating blocks explored for topic:', topic);
    setQuizState(prev => {
      const newBlocksExplored = prev.currentTopic === topic ? prev.blocksExplored + 1 : 1;
      const shouldTriggerQuiz = newBlocksExplored >= 4;
      
      console.log('Blocks explored:', newBlocksExplored, 'Should trigger quiz:', shouldTriggerQuiz);
      
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