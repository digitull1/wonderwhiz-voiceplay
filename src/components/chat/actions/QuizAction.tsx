import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionIcon } from "./ActionIcon";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizActionProps {
  messageText: string;
  onQuizGenerated?: (quiz: any) => void;
}

export const QuizAction = ({ messageText, onQuizGenerated }: QuizActionProps) => {
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  const handleQuizGeneration = async () => {
    setIsGeneratingQuiz(true);
    try {
      console.log('Generating quiz for:', messageText);
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic: messageText }
      });

      if (error) throw error;
      console.log('Quiz response:', data);

      if (data?.question) {
        onQuizGenerated?.(data.question);
        toast({
          title: "Quiz time! 🎯",
          description: "Let's test your knowledge!",
          className: "bg-primary text-white"
        });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate a quiz right now. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <motion.button
      className="action-icon"
      onClick={handleQuizGeneration}
      disabled={isGeneratingQuiz}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Take a quiz"
    >
      <AnimatePresence mode="wait">
        {isGeneratingQuiz ? (
          <motion.div
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -180 }}
          >
            <Loader2 className="w-3.5 h-3.5 text-primary/70 animate-spin" />
          </motion.div>
        ) : (
          <BookOpen className="w-3.5 h-3.5 text-primary/70" />
        )}
      </AnimatePresence>
    </motion.button>
  );
};