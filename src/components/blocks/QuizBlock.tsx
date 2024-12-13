import React from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSparkles } from "../LoadingSparkles";
import { Block } from "@/types/chat";

interface QuizBlockProps {
  block: Block;
  onQuizGenerated?: (quiz: any) => void;
}

export const QuizBlock = ({ block, onQuizGenerated }: QuizBlockProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleQuizGeneration = async () => {
    setIsLoading(true);
    try {
      console.log('Generating quiz for topic:', block.metadata.topic);
      
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { 
          topic: block.metadata.topic || block.title,
          contextualPrompt: `Create engaging quiz questions about ${block.metadata.topic}. 
          Make them fun and educational!`
        }
      });

      if (error) {
        console.error('Error generating quiz:', error);
        throw error;
      }

      console.log('Quiz data received:', data);

      if (data?.questions) {
        onQuizGenerated?.(data.questions);
        toast({
          title: "Quiz time! 🎯",
          description: "Let's test what you've learned!",
          className: "bg-primary text-white"
        });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Oops!",
        description: "Couldn't create a quiz right now. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleQuizGeneration}
      className="w-full p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                 rounded-lg border border-white/10 backdrop-blur-sm
                 hover:scale-105 transition-all duration-300
                 flex items-center justify-center gap-3"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSparkles />
      ) : (
        <>
          <span className="text-2xl">🎯</span>
          <span className="text-white/90">Start Quiz</span>
        </>
      )}
    </motion.button>
  );
};