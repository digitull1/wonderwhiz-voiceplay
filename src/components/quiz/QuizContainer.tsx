import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "./QuizQuestion";
import { QuizCompletion } from "./QuizCompletion";
import { generateQuiz } from "@/utils/quizGenerator";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { LoadingSparkles } from "../LoadingSparkles";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizContainerProps {
  topic: string;
  onComplete: () => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  topic,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('age')
          .eq('id', user.id)
          .single();

        const age = profileData?.age || 8;
        const quizQuestions = await generateQuiz(topic, age);
        
        if (quizQuestions.length > 0) {
          setQuestions(quizQuestions);
        } else {
          toast({
            title: "Oops!",
            description: "Couldn't create a quiz right now. Try again later!",
            variant: "destructive"
          });
          onComplete();
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again!",
          variant: "destructive"
        });
        onComplete();
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [topic, onComplete]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const pointsToAdd = 10; // Base points for correct answer
          
          const { error } = await supabase
            .from('user_progress')
            .update({ 
              points: pointsToAdd,
              quiz_score: supabase.raw('quiz_score + 1')
            })
            .eq('user_id', user.id);

          if (error) throw error;

          toast({
            title: "Correct! 🎉",
            description: `You earned ${pointsToAdd} points!`,
            className: "bg-primary text-white"
          });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', user.id)
        .single();

      const age = profileData?.age || 8;
      const newQuestions = await generateQuiz(topic, age);
      
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
      } else {
        toast({
          title: "Oops!",
          description: "Couldn't create a new quiz. Try again later!",
          variant: "destructive"
        });
        onComplete();
      }
    } catch (error) {
      console.error('Error restarting quiz:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again!",
        variant: "destructive"
      });
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSparkles />;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <QuizCompletion
        score={score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        onExploreMore={onComplete}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <QuizQuestion
        key={currentQuestionIndex}
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </AnimatePresence>
  );
};