import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const { toast } = useToast();
  
  const handleAnswer = (index: number) => {
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "🎉 Correct!",
        description: "Amazing job! You've earned 10 points!",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Not quite!",
        description: `The correct answer was: ${question.options[question.correctAnswer]}`,
        className: "bg-primary text-white",
      });
    }
    
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-chat-ai rounded-xl p-6 shadow-lg space-y-4"
    >
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full text-left justify-start p-4 hover:bg-primary/10"
              onClick={() => handleAnswer(index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};