import React from "react";
import { motion } from "framer-motion";
import { Image, BookOpen, Trophy } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageGenerator } from "../ImageGenerator";
import { useBlockGeneration } from "@/hooks/useBlockGeneration";

interface PostChatActionsProps {
  messageText: string;
  onPanelOpen?: () => void;
}

const ActionButton = ({ 
  icon: Icon, 
  tooltip,
  onClick,
  className = ""
}: { 
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  className?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button 
          className={`action-icon bg-gradient-to-br from-primary/10 to-secondary/10
            hover:from-primary/20 hover:to-secondary/20 p-1.5 sm:p-2 ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs sm:text-sm font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PostChatActions = ({ messageText, onPanelOpen }: PostChatActionsProps) => {
  const { toast } = useToast();
  const { generateDynamicBlocks } = useBlockGeneration(null);

  const handleImageGeneration = async () => {
    try {
      if (!messageText?.trim()) {
        toast({
          title: "Oops!",
          description: "I need some context to create an image. Try asking a question first!",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: messageText }
      });

      if (error) throw error;

      toast({
        title: "Image created! ✨",
        description: "Here's what I imagined!",
        className: "bg-primary text-white"
      });

      return data.image;
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Oops!",
        description: "Couldn't create an image right now. Try again!",
        variant: "destructive"
      });
    }
  };

  const handleQuizGeneration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic: messageText }
      });

      if (error) throw error;

      // Generate explanation and blocks based on the answer
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

    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate a quiz right now. Try again!",
        variant: "destructive"
      });
    }
  };

  const actions = [
    { 
      icon: Image, 
      tooltip: "Create a picture!", 
      onClick: handleImageGeneration,
      className: "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
    },
    { 
      icon: BookOpen, 
      tooltip: "Take a quiz!", 
      onClick: handleQuizGeneration,
      className: "bg-gradient-to-br from-green-500/10 to-teal-500/10"
    },
    { 
      icon: Trophy, 
      tooltip: "See your progress!", 
      onClick: onPanelOpen,
      className: "bg-gradient-to-br from-orange-500/10 to-yellow-500/10"
    }
  ];

  return (
    <motion.div 
      className="post-chat-actions gap-2"
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