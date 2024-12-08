import { supabase } from "@/integrations/supabase/client";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

export const handleQuizGeneration = async (topic: string, age: number, toastFn: typeof toast) => {
  console.log('Generating quiz with params:', { topic, age });
  
  const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-quiz', {
    body: JSON.stringify({ 
      topic,
      age,
      contextualPrompt: `Create ${age}-appropriate quiz questions specifically about ${topic}. 
      The questions should be fun, engaging, and directly related to the topic.
      Start with simpler questions and gradually increase difficulty.`
    })
  });

  if (quizError) {
    console.error('Quiz generation error:', quizError);
    throw quizError;
  }
  
  console.log('Quiz data received:', quizData);

  if (quizData?.questions) {
    const event = new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `Let's test what you've learned about ${topic}! 🎯`,
        isAi: true,
        quizState: {
          isActive: true,
          currentQuestion: quizData.questions,
          blocksExplored: 0,
          currentTopic: topic
        }
      }
    });
    window.dispatchEvent(event);

    toastFn({
      title: "Quiz time! 🎯",
      description: "Let's test what you've learned!",
      className: "bg-primary text-white"
    });
  }
};