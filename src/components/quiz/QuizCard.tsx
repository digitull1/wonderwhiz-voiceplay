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
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BFAAFF', '#38C9C9', '#FF6F61', '#FFDD57']
      });
    }
    
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-[#F4E7FE] to-[#E8E8FF] rounded-xl p-6 shadow-lg space-y-4"
    >
      <motion.h3 
        className="text-lg font-semibold mb-4"
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
                whileHover={!showCorrect ? { scale: 1.02 } : {}}
                whileTap={!showCorrect ? { scale: 0.98 } : {}}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start p-4 relative overflow-hidden",
                    "transition-all duration-300",
                    showResult && isCorrect ? "bg-green-500 text-white" :
                    showResult && isSelected ? "bg-red-500 text-white" :
                    index % 3 === 0 ? "bg-[#4CABFF]" :
                    index % 3 === 1 ? "bg-[#FF6B6B]" : "bg-[#C7F6D5]",
                    "text-white font-medium"
                  )}
                  onClick={() => !showCorrect && handleAnswerClick(index)}
                  disabled={showCorrect}
                >
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={false}
                    animate={{
                      scale: showResult && isCorrect ? [1, 1.5, 1] : 1,
                      opacity: showResult && isCorrect ? [0, 0.2, 0] : 0
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  
                  <span className="relative z-10">
                    {String.fromCharCode(65 + index)}. {option}
                    {showResult && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2"
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
          >
            {selectedAnswer === question.correctAnswer ? (
              <span className="text-green-500">Amazing job! You got it right! 🎉</span>
            ) : (
              <span className="text-primary">
                The correct answer was: {question.options[question.correctAnswer]} ✨
              </span>
            )}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};