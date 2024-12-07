import React from "react";
import { motion } from "framer-motion";
import { quizStyles } from "./quizStyles";

interface QuizCompletionProps {
  correctAnswers: number;
}

export const QuizCompletion = ({ correctAnswers }: QuizCompletionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <h3 className="text-2xl font-bold text-white mb-4">
        Quiz Complete! 🎉
      </h3>
      <p className="text-white/90 text-lg">
        You got {correctAnswers} out of 5 questions correct!
      </p>
      <div className={quizStyles.relatedTopicsContainer}>
        <p className="text-white/90 text-sm">
          Want to explore more? Check out these related topics!
        </p>
      </div>
    </motion.div>
  );
};