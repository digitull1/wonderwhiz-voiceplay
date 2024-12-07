import React from "react";
import { motion } from "framer-motion";
import { ChatBlocks } from "../ChatBlocks";
import { Block } from "@/types/chat";
import { cn } from "@/lib/utils";

interface QuizCompletionProps {
  correctAnswers: number;
  totalQuestions: number;
  currentTopic: string;
}

export const QuizCompletion = ({ correctAnswers, totalQuestions, currentTopic = "this topic" }: QuizCompletionProps) => {
  const generateRelatedBlocks = (topic: string): Block[] => {
    // Safely handle topic splitting with fallback
    const topicWords = topic ? topic.split(' ').filter(word => word.length > 3) : [];
    const mainTopic = topicWords.length > 0 ? 
      topicWords[Math.floor(Math.random() * topicWords.length)] : 
      topic;
    
    return [
      {
        title: `Want to learn more about ${topic}? Let's dive deeper! 🎯`,
        description: "Explore deeper insights",
        metadata: {
          topic: topic,
          type: "fact"
        }
      },
      {
        title: `Ready for another ${topic} quiz challenge? Test your knowledge! 🎮`,
        description: "Test your knowledge further",
        metadata: {
          topic: topic,
          type: "quiz"
        }
      },
      {
        title: `Curious about topics related to ${mainTopic}? Let's explore together! 🌟`,
        description: "Discover connected subjects",
        metadata: {
          topic: mainTopic,
          type: "fact"
        }
      }
    ];
  };

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
          Want to explore more about {currentTopic}? ✨
        </h4>
        <ChatBlocks blocks={generateRelatedBlocks(currentTopic)} onBlockClick={() => {}} />
      </motion.div>
    </motion.div>
  );
};