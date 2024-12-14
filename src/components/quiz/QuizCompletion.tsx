import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface QuizCompletionProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onExploreMore: () => void;
}

export const QuizCompletion: React.FC<QuizCompletionProps> = ({
  score,
  totalQuestions,
  onRestart,
  onExploreMore,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }, []);

  const percentage = (score / totalQuestions) * 100;
  
  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You're amazing! 🌟";
    if (percentage >= 80) return "Fantastic job! You're super smart! 🎉";
    if (percentage >= 60) return "Great effort! Keep learning and growing! 💪";
    return "Good try! Every question helps us learn something new! 🌱";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 p-8"
    >
      <motion.h3 
        className="text-2xl font-bold text-white mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        Quiz Complete! 🎉
      </motion.h3>
      
      <motion.div 
        className="p-6 rounded-lg bg-white/10 backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p className="text-white/90 text-xl mb-3">
          You got {score} out of {totalQuestions} questions correct!
        </motion.p>
        <motion.p className="text-white/80 text-lg">
          {getMessage()}
        </motion.p>
      </motion.div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={onRestart}
          variant="outline"
          className="bg-white/10 text-white hover:bg-white/20"
        >
          Try Another Quiz 🎯
        </Button>
        <Button
          onClick={onExploreMore}
          className="bg-primary hover:bg-primary/90"
        >
          Explore More Topics ✨
        </Button>
      </div>
    </motion.div>
  );
};