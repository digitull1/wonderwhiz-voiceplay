import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  selectedAnswer: number | null;
  showCorrect: boolean;
  onAnswerClick: (index: number) => void;
}

export const QuestionDisplay = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  correctAnswers,
  selectedAnswer,
  showCorrect,
  onAnswerClick
}: QuestionDisplayProps) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-white/90 text-sm font-medium">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-white/90 text-sm font-medium">
          Score: {correctAnswers}/{totalQuestions}
        </span>
      </div>

      <motion.h3 
        className="text-xl sm:text-2xl font-semibold mb-6 text-white leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.question}
      </motion.h3>
      
      <div className="grid gap-3">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = showCorrect && (isSelected || isCorrect);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!showCorrect ? { scale: 1.02, x: 4 } : {}}
                whileTap={!showCorrect ? { scale: 0.98 } : {}}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start p-4 relative overflow-hidden",
                    "transition-all duration-300",
                    "bg-white/10 text-white border-white/20 backdrop-blur-xl hover:bg-white/20",
                    showResult && isCorrect && "bg-green-500/90 text-white border-white/20",
                    showResult && isSelected && !isCorrect && "bg-red-500/90 text-white border-white/20",
                    "sm:text-lg text-base group font-medium"
                  )}
                  onClick={() => !showCorrect && onAnswerClick(index)}
                  disabled={showCorrect}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-sm font-bold px-2 py-1 bg-white/20 rounded">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-xl"
                      >
                        {isCorrect ? "✨" : isSelected ? "❌" : ""}
                      </motion.span>
                    )}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};