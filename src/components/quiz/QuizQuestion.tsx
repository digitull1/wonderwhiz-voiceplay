import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  onNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    setShowResult(true);
    onAnswer(isCorrect);
    
    setTimeout(() => {
      onNext();
      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <motion.h3 
        className="text-xl font-semibold mb-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {question.question}
      </motion.h3>

      <div className="grid gap-3">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showFeedback = showResult && (isSelected || isCorrect);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!showResult ? { scale: 1.02 } : {}}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start p-4",
                    "bg-white/10 text-white border-white/20",
                    showFeedback && isCorrect && "bg-green-500/20",
                    showFeedback && isSelected && !isCorrect && "bg-red-500/20",
                    "hover:bg-white/20 transition-all duration-300"
                  )}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold px-2 py-1 rounded-full bg-white/20">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showFeedback && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xl"
                      >
                        {isCorrect ? "✨" : "❌"}
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