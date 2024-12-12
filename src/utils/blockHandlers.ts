import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const handleImageBlock = async (block: Block) => {
  console.log('Handling image block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt: block.metadata.topic || block.title }
    });

    if (error) {
      console.error('Error generating image:', error);
      throw error;
    }

    console.log('Image generation response:', data);

    if (data?.image) {
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: "Here's what I imagined based on your request! What do you think? ✨",
          isAi: true,
          imageUrl: data.image
        }
      });
      window.dispatchEvent(event);

      toast({
        title: "Image created! ✨",
        description: "Here's what I imagined!",
        className: "bg-primary text-white"
      });
    }
  } catch (error) {
    console.error('Error in handleImageBlock:', error);
    toast({
      title: "Oops!",
      description: "Couldn't create an image right now. Try again!",
      variant: "destructive"
    });
  }
};

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: JSON.stringify({
        topic: block.metadata.topic || block.title,
        age,
        contextualPrompt: `Create ${age}-appropriate quiz questions about ${block.metadata.topic}. 
        Make them fun and engaging!`
      })
    });

    if (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }

    console.log('Quiz generation response:', data);

    if (data?.questions) {
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: `Let's test what you've learned about ${block.metadata.topic}! 🎯`,
          isAi: true,
          quizState: {
            isActive: true,
            currentQuestion: data.questions,
            blocksExplored: 0,
            currentTopic: block.metadata.topic
          }
        }
      });
      window.dispatchEvent(event);

      toast({
        title: "Quiz time! 🎯",
        description: "Let's test what you've learned!",
        className: "bg-primary text-white"
      });
    }
  } catch (error) {
    console.error('Error in handleQuizBlock:', error);
    toast({
      title: "Oops!",
      description: "Couldn't create a quiz right now. Try again!",
      variant: "destructive"
    });
  }
};