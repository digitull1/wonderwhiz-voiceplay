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
        <motion.span 
          className="text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-full shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </motion.span>
        <motion.span 
          className="text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-full shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          Score: {correctAnswers}/{totalQuestions}
        </motion.span>
      </div>

      <motion.h3 
        className="text-xl sm:text-2xl font-semibold mb-6 text-white leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
                    "bg-white/20 text-white border-white/30 backdrop-blur-xl hover:bg-white/30",
                    showResult && isCorrect && "bg-green-500/90 text-white border-white/20",
                    showResult && isSelected && !isCorrect && "bg-red-500/90 text-white border-white/20",
                    "sm:text-lg text-base group font-medium",
                    "hover:shadow-xl hover:border-white/40"
                  )}
                  onClick={() => !showCorrect && onAnswerClick(index)}
                  disabled={showCorrect}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className={cn(
                      "text-sm font-bold px-3 py-1.5 rounded-full transition-colors",
                      "bg-white/30 group-hover:bg-white/40"
                    )}>
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
                  {!showCorrect && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear"
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};