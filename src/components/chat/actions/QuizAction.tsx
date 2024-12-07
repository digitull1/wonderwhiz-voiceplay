import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
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
    if (isGeneratingQuiz) return;
    
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
    <ActionIcon
      icon={isGeneratingQuiz ? Loader2 : BookOpen}
      tooltip="Take a quiz!"
      onClick={handleQuizGeneration}
      isLoading={isGeneratingQuiz}
      className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 text-white hover:from-orange-500/30 hover:to-yellow-500/30"
    />
  );
};