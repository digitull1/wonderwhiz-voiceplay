import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuizCompletion } from "./QuizCompletion";
import { cn } from "@/lib/utils";
import { RewardAnimation } from "../rewards/RewardAnimation";
import { QuizQuestion } from "@/types/quiz";
import confetti from "canvas-confetti";

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
  const [score, setScore] = useState(0);

  const questionsArray = Array.isArray(questions) ? questions : [questions];
  const currentTopic = questionsArray[0]?.topic || "this topic";

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrect(true);
    const currentQuestion = questionsArray[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowReward(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FEC6A1', '#9b87f5', '#33C3F0']
      });
      setTimeout(() => setShowReward(false), 2000);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questionsArray.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowCorrect(false);
      } else {
        setQuizComplete(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FEC6A1', '#9b87f5', '#33C3F0']
        });
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
          "bg-gradient-to-br from-violet-500/95 via-purple-500/95 to-blue-500/95",
          "rounded-2xl shadow-luxury border border-white/20",
          "backdrop-blur-xl overflow-hidden"
        )}
      >
        <ScrollArea className="h-[400px] w-full p-4 sm:p-6">
          {!quizComplete ? (
            <QuestionDisplay
              question={questionsArray[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questionsArray.length}
              correctAnswers={score}
              selectedAnswer={selectedAnswer}
              showCorrect={showCorrect}
              onAnswerClick={handleAnswerClick}
            />
          ) : (
            <QuizCompletion 
              score={score}
              totalQuestions={questionsArray.length}
              onRestart={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setQuizComplete(false);
                setSelectedAnswer(null);
                setShowCorrect(false);
              }}
              onExploreMore={() => {
                // Handle explore more action
                console.log("Exploring more topics...");
              }}
            />
          )}
        </ScrollArea>
      </motion.div>
    </>
  );
};