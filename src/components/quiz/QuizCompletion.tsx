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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <h3 className="text-2xl font-bold text-white mb-4">
        Quiz Complete! 🎉
      </h3>
      
      <div className={cn(
        "p-4 rounded-lg bg-white/10 backdrop-blur-sm",
        "border border-white/20"
      )}>
        <p className="text-white/90 text-lg mb-2">
          You got {correctAnswers} out of {totalQuestions} questions correct!
        </p>
        <p className="text-white/80 text-sm">
          {correctAnswers === totalQuestions 
            ? "Perfect score! You're amazing! 🌟" 
            : "Great effort! Keep learning and try again! 💪"}
        </p>
      </div>

      <div className="mt-8">
        <h4 className="text-white/90 text-lg font-medium mb-4">
          Want to explore more? Check out these topics! ✨
        </h4>
        <ChatBlocks blocks={relatedBlocks} onBlockClick={() => {}} />
      </div>
    </motion.div>
  );
};