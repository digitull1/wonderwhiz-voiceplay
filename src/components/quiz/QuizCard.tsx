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
        colors: ['#BFAAFF', '#38C9C9', '#FF6F61', '#FFDD57'],
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
      className="bg-gradient-to-br from-[#1A1F2C]/95 via-[#2A2F3C]/98 to-[#1A1F2C]/95 
        rounded-xl p-6 shadow-lg space-y-4 border border-white/10 backdrop-blur-sm text-white"
    >
      <motion.h3 
        className="text-lg font-semibold mb-4 text-white"
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
                    "bg-gradient-to-r from-[#2A2F3C]/80 to-[#1A1F2C]/90 text-white border-white/10 backdrop-blur-sm",
                    "hover:shadow-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  )}
                  onClick={() => !showCorrect && handleAnswerClick(index)}
                  disabled={showCorrect}
                >
                  <motion.div 
                    className="absolute inset-0 bg-white/10"
                    initial={false}
                    animate={{
                      scale: showResult && isCorrect ? [1, 1.5, 1] : 1,
                      opacity: showResult && isCorrect ? [0, 0.2, 0] : 0
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  
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
              "p-3 rounded-lg",
              selectedAnswer === question.correctAnswer ?
                "bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-300" :
                "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary-foreground"
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