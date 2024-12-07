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
  onClick
}: { 
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button 
          className="action-icon bg-gradient-to-br from-primary/20 to-secondary/20
            hover:from-primary/30 hover:to-secondary/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PostChatActions = ({ messageText, onPanelOpen }: PostChatActionsProps) => {
  const [showImageGenerator, setShowImageGenerator] = React.useState(false);
  const { toast } = useToast();
  const { generateDynamicBlocks } = useBlockGeneration(null);

  const handleImageGeneration = () => {
    setShowImageGenerator(true);
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
    { icon: Image, tooltip: "Create a picture for this!", onClick: handleImageGeneration },
    { icon: BookOpen, tooltip: "Test your knowledge!", onClick: handleQuizGeneration },
    { icon: Trophy, tooltip: "Check your progress!", onClick: onPanelOpen }
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

      {showImageGenerator && (
        <div className="mt-4">
          <ImageGenerator 
            prompt={messageText}
            onResponse={(response, blocks) => {
              setShowImageGenerator(false);
              // Handle the response and blocks
            }}
          />
        </div>
      )}
    </motion.div>
  );
};