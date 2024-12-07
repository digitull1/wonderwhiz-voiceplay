import React from "react";
import { motion } from "framer-motion";
import { ChatBlocks } from "../ChatBlocks";
import { Block } from "@/types/chat";
import { cn } from "@/lib/utils";

interface QuizCompletionProps {
  correctAnswers: number;
  totalQuestions: number;
}

export const QuizCompletion = ({ correctAnswers, totalQuestions }: QuizCompletionProps) => {
  const relatedBlocks: Block[] = [
    {
      title: "Want to learn more about this topic? Let's dive deeper! 🎯",
      description: "Explore more fascinating facts",
      metadata: {
        topic: "related_topic_1",
        type: "fact"
      }
    },
    {
      title: "Ready for another quiz challenge? Test your knowledge! 🎮",
      description: "Take another quiz",
      metadata: {
        topic: "related_topic_2",
        type: "quiz"
      }
    },
    {
      title: "Curious about similar topics? Let's explore together! 🌟",
      description: "Discover related subjects",
      metadata: {
        topic: "related_topic_3",
        type: "fact"
      }
    }
  ];

  const getCompletionMessage = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage === 100) return "Perfect score! You're absolutely amazing! 🌟";
    if (percentage >= 80) return "Fantastic job! You're super smart! 🎉";
    if (percentage >= 60) return "Great effort! Keep learning and growing! 💪";
    return "Good try! Every question is a chance to learn something new! 🌱";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
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
        className={cn(
          "p-6 rounded-lg backdrop-blur-sm",
          "bg-gradient-to-br from-white/20 to-white/10",
          "border border-white/20"
        )}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p 
          className="text-white/90 text-xl mb-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You got {correctAnswers} out of {totalQuestions} questions correct!
        </motion.p>
        <motion.p 
          className="text-white/80 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getCompletionMessage()}
        </motion.p>
      </motion.div>

      <motion.div 
        className="mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-white/90 text-lg font-medium mb-4">
          Want to explore more? Check out these exciting topics! ✨
        </h4>
        <ChatBlocks blocks={relatedBlocks} onBlockClick={() => {}} />
      </motion.div>
    </motion.div>
  );
};