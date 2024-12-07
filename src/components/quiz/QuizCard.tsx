import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuizCompletion } from "./QuizCompletion";
import { quizStyles } from "./quizStyles";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { RewardAnimation } from "../rewards/RewardAnimation";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrect(true);
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowCorrect(false);
      } else {
        setQuizComplete(true);
      }
      onAnswer(isCorrect);
    }, 2000);
  };

  return (
    <>
      {showReward && <RewardAnimation type="quiz" />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={quizStyles.container}
      >
        <ScrollArea className="h-[400px] w-full p-4 sm:p-6">
          {!quizComplete ? (
            <QuestionDisplay
              question={question}
              currentQuestionIndex={currentQuestionIndex}
              correctAnswers={correctAnswers}
              selectedAnswer={selectedAnswer}
              showCorrect={showCorrect}
              onAnswerClick={handleAnswerClick}
            />
          ) : (
            <QuizCompletion correctAnswers={correctAnswers} />
          )}
        </ScrollArea>
      </motion.div>
    </>
  );
};