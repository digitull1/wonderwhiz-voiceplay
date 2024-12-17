import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "./errorHandler";

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: block.title,
        age,
        contextualPrompt: `Create a multiple-choice quiz for kids aged ${age} on "${block.title}".
        Include:
        - A fun, clear question
        - 3 options (1 correct, 2 silly distractors)
        - Correct answer feedback`
      }
    });

    if (error) throw error;

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