import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrect(true);
    onAnswer(index === question.correctAnswer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#F4E7FE] rounded-xl p-6 shadow-lg space-y-4"
    >
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      
      <div className="grid gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showResult = showCorrect && (isSelected || isCorrect);
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: !showCorrect ? 1.02 : 1 }}
              whileTap={{ scale: !showCorrect ? 0.98 : 1 }}
            >
              <Button
                variant="outline"
                className={cn(
                  "w-full text-left justify-start p-4",
                  "transition-all duration-300",
                  showResult && isCorrect ? "bg-green-500 text-white" :
                  showResult && isSelected ? "bg-red-500 text-white" :
                  index % 3 === 0 ? "bg-[#4CABFF]" :
                  index % 3 === 1 ? "bg-[#FF6B6B]" : "bg-[#C7F6D5]",
                  "text-white"
                )}
                onClick={() => !showCorrect && handleAnswerClick(index)}
                disabled={showCorrect}
              >
                {String.fromCharCode(65 + index)}. {option}
                {showResult && isCorrect && " ✅"}
                {showResult && isSelected && !isCorrect && " ❌"}
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      {showCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center font-medium"
        >
          {selectedAnswer === question.correctAnswer
            ? "Great job! That's correct! 🎉"
            : `The correct answer was: ${question.options[question.correctAnswer]} ✨`}
        </motion.p>
      )}
    </motion.div>
  );
};