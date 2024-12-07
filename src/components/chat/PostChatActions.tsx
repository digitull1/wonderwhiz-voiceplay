import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, BookOpen, Trophy, Loader2 } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBlockGeneration } from "@/hooks/useBlockGeneration";

interface PostChatActionsProps {
  messageText: string;
  onPanelOpen?: () => void;
}

const ActionButton = ({ 
  icon: Icon, 
  tooltip,
  onClick,
  isLoading = false,
  className = ""
}: { 
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button 
          className={`action-icon bg-gradient-to-br from-primary/5 to-secondary/5
            hover:from-primary/10 hover:to-secondary/10 relative ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          disabled={isLoading}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="w-3 h-3 animate-spin text-primary/70" />
              </motion.div>
            ) : (
              <Icon className="w-3 h-3 text-primary/70" />
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PostChatActions = ({ messageText, onPanelOpen }: PostChatActionsProps) => {
  const { toast } = useToast();
  const { generateDynamicBlocks } = useBlockGeneration(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);

  const handleImageGeneration = async () => {
    if (!messageText?.trim()) {
      toast({
        title: "Oops!",
        description: "I need some context to create an image. Try asking a question first!",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: messageText }
      });

      if (error) throw error;

      if (data.image) {
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
    if (!messageText?.trim()) {
      toast({
        title: "Oops!",
        description: "I need some context to create a quiz. Let's chat a bit more!",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      console.log('Generating quiz for:', messageText);
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic: messageText }
      });

      if (error) throw error;

      console.log('Quiz response:', data);

      if (data.question) {
        const explanation = await supabase.functions.invoke('generate-response', {
          body: { 
            prompt: `Explain why this answer is correct: ${data.question.options[data.question.correctAnswer]}`,
            max_words: 100
          }
        });

        const blocks = await generateDynamicBlocks(
          explanation.data.response,
          messageText
        );

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

  const handlePanelOpen = () => {
    if (onPanelOpen) {
      onPanelOpen();
      toast({
        title: "Progress Panel",
        description: "Check out your learning journey!",
        className: "bg-primary text-white"
      });
    }
  };

  const actions = [
    { 
      icon: Image, 
      tooltip: "Create a picture!", 
      onClick: handleImageGeneration,
      isLoading: isGeneratingImage,
      className: "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
    },
    { 
      icon: BookOpen, 
      tooltip: "Take a quiz!", 
      onClick: handleQuizGeneration,
      isLoading: isGeneratingQuiz,
      className: "bg-gradient-to-br from-green-500/5 to-teal-500/5"
    },
    { 
      icon: Trophy, 
      tooltip: "See your progress!", 
      onClick: handlePanelOpen,
      className: "bg-gradient-to-br from-orange-500/5 to-yellow-500/5"
    }
  ];

  return (
    <motion.div 
      className="post-chat-actions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </motion.div>
  );
};