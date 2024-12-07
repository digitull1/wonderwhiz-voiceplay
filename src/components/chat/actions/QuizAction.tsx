import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizActionProps {
  onQuizGenerated: (quiz: any) => void;
  messageText: string;
  className?: string;
}

export const QuizAction: React.FC<QuizActionProps> = ({ 
  onQuizGenerated, 
  messageText,
  className 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuizGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const quiz = await response.json();
      onQuizGenerated(quiz);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleQuizGeneration}
      disabled={isLoading}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "hover:bg-white hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "bg-gradient-to-br from-accent/20 to-primary/20",
        className
      )}
    >
      <BookOpen className="w-4 h-4" />
    </Button>
  );
};