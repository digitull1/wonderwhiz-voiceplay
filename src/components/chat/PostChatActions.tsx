import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, BookOpen, Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PostChatActionsProps {
  messageText: string;
  onPanelOpen?: () => void;
  onQuizGenerated?: (quiz: any) => void;
}

export const PostChatActions = ({ 
  messageText, 
  onPanelOpen,
  onQuizGenerated 
}: PostChatActionsProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  const handleImageGeneration = async () => {
    setIsGeneratingImage(true);
    try {
      console.log('Generating image for prompt:', messageText);
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: messageText }
      });

      if (error) throw error;

      if (data?.image) {
        console.log('Image generated successfully:', data.image);
        toast({
          title: "Image created! ✨",
          description: "Here's what I imagined!",
          className: "bg-primary text-white"
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Oops!",
        description: "Couldn't create an image right now. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

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

  const handleTrophyClick = () => {
    if (onPanelOpen) {
      onPanelOpen();
      toast({
        title: "Progress Panel",
        description: "Check out your learning journey!",
        className: "bg-primary text-white"
      });
    }
  };

  return (
    <motion.div 
      className="inline-flex items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.2,
        delay: 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <motion.button
        className="action-icon"
        onClick={handleImageGeneration}
        disabled={isGeneratingImage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Generate an image"
      >
        <AnimatePresence mode="wait">
          {isGeneratingImage ? (
            <motion.div
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
            >
              <Loader2 className="w-3.5 h-3.5 text-primary/70 animate-spin" />
            </motion.div>
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-primary/70" />
          )}
        </AnimatePresence>
      </motion.button>

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

      <motion.button
        className="action-icon"
        onClick={handleTrophyClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="View your progress"
      >
        <Trophy className="w-3.5 h-3.5 text-primary/70" />
      </motion.button>
    </motion.div>
  );
};