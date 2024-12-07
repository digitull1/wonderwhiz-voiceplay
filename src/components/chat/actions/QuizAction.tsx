import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { ActionIcon } from "./ActionIcon";

interface QuizActionProps {
  onQuizGenerated: (quiz: any) => void;
  messageText: string;
  icon: LucideIcon;
  tooltip: string;
  className?: string;
}

export const QuizAction: React.FC<QuizActionProps> = ({ 
  onQuizGenerated, 
  messageText, 
  icon,
  tooltip,
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
    <ActionIcon
      icon={icon}
      tooltip={tooltip}
      onClick={handleQuizGeneration}
      isLoading={isLoading}
      className={className}
    />
  );
};