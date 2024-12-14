import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { QuizQuestion } from "@/types/quiz";

export const generateQuiz = async (topic: string, age: number): Promise<QuizQuestion[]> => {
  try {
    console.log('Generating quiz for:', { topic, age });
    
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic,
        age,
        contextualPrompt: `Create 5 engaging, educational quiz questions about ${topic} 
          that are appropriate for a ${age}-year-old child. Make them fun and interesting!`
      }
    });

    if (error) throw error;

    console.log('Quiz generation response:', data);
    return data.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    toast({
      title: "Couldn't create quiz",
      description: "Let's try something else fun instead!",
      variant: "destructive"
    });
    return [];
  }
};