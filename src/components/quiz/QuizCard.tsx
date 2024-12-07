import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuizCompletion } from "./QuizCompletion";
import { cn } from "@/lib/utils";
import { RewardAnimation } from "../rewards/RewardAnimation";
import { QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  questions: QuizQuestion | QuizQuestion[];
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ questions, onAnswer }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Convert single question to array if needed
  const questionsArray = Array.isArray(questions) ? questions : [questions];
  console.log("Questions array:", questionsArray);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrect(true);
    const currentQuestion = questionsArray[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questionsArray.length - 1) {
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
        className={cn(
          "w-full max-w-2xl mx-auto",
          "bg-gradient-to-br from-primary/95 to-secondary/95",
          "rounded-xl shadow-luxury border border-white/10",
          "backdrop-blur-sm overflow-hidden"
        )}
      >
        <ScrollArea className="h-[400px] w-full p-4 sm:p-6">
          {!quizComplete ? (
            <QuestionDisplay
              question={questionsArray[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questionsArray.length}
              correctAnswers={correctAnswers}
              selectedAnswer={selectedAnswer}
              showCorrect={showCorrect}
              onAnswerClick={handleAnswerClick}
            />
          ) : (
            <QuizCompletion 
              correctAnswers={correctAnswers} 
              totalQuestions={questionsArray.length}
            />
          )}
        </ScrollArea>
      </motion.div>
    </>
  );
};