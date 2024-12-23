import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { handleError } from "./errorHandler";

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: block.metadata.topic,
        age,
        contextualPrompt: `Create an engaging educational quiz about "${block.metadata.topic}" for children aged ${age}.
        Include exactly 5 multiple-choice questions.
        Each question must have:
        - A clear, fun question text
        - Exactly 4 answer options
        - One correct answer
        - Make it fun and educational!`
      }
    });

    if (error) throw error;

    console.log('Quiz data received:', data);

    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid quiz data format');
    }

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `Let's test what you've learned about ${block.metadata.topic}! Ready for a fun quiz? 🎯`,
        isAi: true,
        quizState: {
          isActive: true,
          currentQuestion: data.questions,
          blocksExplored: 0,
          currentTopic: block.metadata.topic
        }
      }
    }));

    toast({
      title: "Quiz time! 🎯",
      description: "Let's test your knowledge!",
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleQuizBlock:', error);
    handleError("Couldn't create a quiz right now");
  }
};