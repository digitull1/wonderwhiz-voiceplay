import React from "react";
import { motion } from "framer-motion";
import { ChatBlocks } from "../ChatBlocks";
import { Block } from "@/types/chat";
import { cn } from "@/lib/utils";

interface QuizCompletionProps {
  correctAnswers: number;
  totalQuestions: number;
  currentTopic: string;
  onBlockClick?: (block: Block) => void;
}

export const QuizCompletion = ({ 
  correctAnswers, 
  totalQuestions, 
  currentTopic = "this topic",
  onBlockClick 
}: QuizCompletionProps) => {
  const generateRelatedBlocks = (topic: string): Block[] => {
    // Format topic for better display
    const formattedTopic = topic
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Generate diverse related topics based on the current topic
    const relatedTopics: Block[] = [
      {
        title: `How do ${formattedTopic} affect our daily lives? 🌟`,
        description: "Discover real-world connections",
        metadata: {
          topic: `${topic}_applications`,
          type: "fact"
        }
      },
      {
        title: `Amazing experiments about ${formattedTopic}! 🔬`,
        description: "Try fun science activities",
        metadata: {
          topic: `${topic}_experiments`,
          type: "fact"
        }
      },
      {
        title: `The history of ${formattedTopic} through time! 📚`,
        description: "Journey through history",
        metadata: {
          topic: `${topic}_history`,
          type: "fact"
        }
      },
      {
        title: `Let's draw and explore ${formattedTopic}! 🎨`,
        description: "Create amazing artwork",
        metadata: {
          topic: topic,
          type: "image"
        }
      },
      {
        title: `Ready for more ${formattedTopic} challenges? 🎯`,
        description: "Test your knowledge",
        metadata: {
          topic: topic,
          type: "quiz"
        }
      }
    ];

    return relatedTopics;
  };

  const getCompletionMessage = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage === 100) return "Perfect score! You're absolutely amazing! 🌟";
    if (percentage >= 80) return "Fantastic job! You're super smart! 🎉";
    if (percentage >= 60) return "Great effort! Keep learning and growing! 💪";
    return "Good try! Every question is a chance to learn something new! 🌱";
  };

  const handleBlockClick = (block: Block) => {
    console.log('Quiz completion block clicked:', block);
    if (onBlockClick) {
      onBlockClick(block);
    }
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
          Let's explore more exciting topics about {currentTopic.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}! ✨
        </h4>
        <ChatBlocks blocks={generateRelatedBlocks(currentTopic)} onBlockClick={handleBlockClick} />
      </motion.div>
    </motion.div>
  );
};