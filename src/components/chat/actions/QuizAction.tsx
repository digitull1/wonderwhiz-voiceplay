import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActionIcon } from "./ActionIcon";

interface QuizActionProps {
  messageText: string;
  onQuizGenerated?: (quiz: any) => void;
}

export const QuizAction = ({ messageText, onQuizGenerated }: QuizActionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleQuizGeneration = async () => {
    if (!messageText?.trim()) {
      toast({
        title: "Oops!",
        description: "I need some context to create a quiz. Let's chat a bit more!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    console.log('Generating quiz for:', messageText);

    try {
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
      setIsGenerating(false);
    }
  };

  return (
    <ActionIcon
      icon={BookOpen}
      tooltip="Take a quiz!"
      onClick={handleQuizGeneration}
      isLoading={isGenerating}
      className="bg-gradient-to-br from-green-500/5 to-teal-500/5"
    />
  );
};