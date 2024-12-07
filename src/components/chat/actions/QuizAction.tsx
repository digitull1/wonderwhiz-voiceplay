import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { ActionIcon } from "./ActionIcon";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizActionProps {
  messageText: string;
}

export const QuizAction = ({ messageText }: QuizActionProps) => {
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
        // Dispatch a custom event with the quiz data
        const event = new CustomEvent('wonderwhiz:newMessage', {
          detail: {
            text: "Let's test your knowledge with a fun quiz! 🎯",
            isAi: true,
            quizState: {
              isActive: true,
              currentQuestion: data.question
            }
          }
        });
        window.dispatchEvent(event);

        toast({
          title: "Quiz time! 🎯",
          description: "Let's test your knowledge!",
          className: "bg-primary text-white"
        });
      } else {
        throw new Error('Invalid quiz data received');
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
      icon={isGenerating ? Loader2 : BookOpen}
      tooltip="Take a quiz!"
      onClick={handleQuizGeneration}
      isLoading={isGenerating}
      className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 text-white"
    />
  );
};