import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

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
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#9b87f5', '#33C3F0', '#FEC6A1', '#7E69AB'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ["circle", "square"]
      });
    }
    
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-gradient-to-br from-primary/95 to-secondary/95",
        "rounded-xl p-4 sm:p-6 shadow-luxury space-y-4",
        "border border-white/10 backdrop-blur-sm"
      )}
    >
      <motion.h3 
        className="text-lg sm:text-xl font-semibold mb-4 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.question}
      </motion.h3>
      
      <div className="grid gap-3">
        <AnimatePresence>
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
                    showResult && isCorrect ? 
                      "bg-gradient-to-r from-green-500/90 to-green-400/90 text-white border-white/20" :
                    showResult && isSelected ? 
                      "bg-gradient-to-r from-red-500/90 to-red-400/90 text-white border-white/20" :
                    "bg-white/10 text-white border-white/10 backdrop-blur-sm hover:bg-white/20",
                    "sm:text-base text-sm"
                  )}
                  onClick={() => !showCorrect && handleAnswerClick(index)}
                  disabled={showCorrect}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {String.fromCharCode(65 + index)}.
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
      
      {showCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-medium"
        >
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
              "p-3 rounded-lg text-sm sm:text-base",
              selectedAnswer === question.correctAnswer ?
                "bg-green-500/20 text-white" :
                "bg-primary/20 text-white"
            )}
          >
            {selectedAnswer === question.correctAnswer ? (
              <span>Amazing job! You got it right! 🎉</span>
            ) : (
              <span>
                The correct answer was: {question.options[question.correctAnswer]} ✨
              </span>
            )}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};