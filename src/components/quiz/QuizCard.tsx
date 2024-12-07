import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { RewardAnimation } from "../rewards/RewardAnimation";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrect(true);
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    
    // Delay moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowCorrect(false);
      } else {
        setQuizComplete(true);
      }
      onAnswer(isCorrect);
    }, 2000);
  };

  return (
    <>
      {showReward && <RewardAnimation type="quiz" />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "w-full max-w-2xl mx-auto",
          "bg-gradient-to-br from-primary/95 to-secondary/95",
          "rounded-xl shadow-luxury space-y-4",
          "border border-white/10 backdrop-blur-sm"
        )}
      >
        <ScrollArea className="h-[400px] w-full p-4 sm:p-6">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {!quizComplete ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/80 text-sm">
                    Question {currentQuestionIndex + 1} of 5
                  </span>
                  <span className="text-white/80 text-sm">
                    Score: {correctAnswers}/5
                  </span>
                </div>

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
                              "sm:text-base text-sm group"
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
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : (
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
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <p className="text-white/80 text-sm">
                    Want to explore more? Check out these related topics!
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </ScrollArea>

        {showCorrect && !quizComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-white/10"
          >
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={cn(
                "p-3 rounded-lg text-sm sm:text-base text-center",
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
            
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(prev => prev + 1);
                  setSelectedAnswer(null);
                  setShowCorrect(false);
                }}
                className="bg-white/20 hover:bg-white/30 text-white gap-2"
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};