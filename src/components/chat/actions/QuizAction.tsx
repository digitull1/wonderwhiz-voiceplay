import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { ActionIcon } from "./ActionIcon";
import { LucideIcon } from "lucide-react";

interface QuizActionProps {
  onQuizGenerated: (quiz: any) => void;
  messageText: string;
  icon: LucideIcon;
  tooltip: string;
}

export const QuizAction = ({ 
  onQuizGenerated, 
  messageText,
  icon,
  tooltip
}: QuizActionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuizGeneration = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating quiz for:', messageText);
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: messageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      onQuizGenerated(data.question);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ActionIcon
      icon={isGenerating ? Loader2 : icon}
      tooltip={tooltip}
      onClick={handleQuizGeneration}
      isLoading={isGenerating}
      className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
    />
  );
};
