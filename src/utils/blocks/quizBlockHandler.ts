import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { handleError } from "./errorHandler";

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: block.metadata.topic || block.title,
        age,
        contextualPrompt: `Create a fun, engaging quiz about "${block.title}" for children aged ${age}. 
        Include 5 multiple-choice questions with 4 options each. Make it educational and entertaining!`
      }
    });

    if (error) throw error;

    console.log('Quiz data received:', data);

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `Let's test what you've learned about ${block.title}! Ready to become a quiz champion? 🌟`,
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
      description: "Let's see what you know!",
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleQuizBlock:', error);
    handleError("Couldn't create a quiz right now");
  }
};