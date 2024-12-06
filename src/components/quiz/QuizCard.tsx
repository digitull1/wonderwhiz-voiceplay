import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#F4E7FE] rounded-xl p-6 shadow-lg space-y-4"
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
              onClick={() => onAnswer(index === question.correctAnswer)}
              style={{
                backgroundColor: index % 3 === 0 ? "#4CABFF" : 
                              index % 3 === 1 ? "#FF6B6B" : "#C7F6D5",
                color: "white"
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};