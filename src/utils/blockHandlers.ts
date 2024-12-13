import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const handleImageBlock = async (block: Block) => {
  console.log('Handling image block:', block);
  
  try {
    const prompt = block.metadata.prompt || `Create a detailed, educational illustration about ${block.title}`;
    console.log('Generating image with prompt:', prompt);

    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt,
        age_group: "8-12"
      }
    });

    if (error) {
      console.error('Error generating image:', error);
      throw error;
    }

    console.log('Image generation response:', data);

    if (data?.image) {
      // Dispatch event to show the generated image in chat
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: `I've created this magical illustration about "${block.title.replace('🎨', '').trim()}"! What do you think? Let's explore what we can learn from it! ✨`,
          isAi: true,
          imageUrl: data.image
        }
      });
      window.dispatchEvent(event);

      toast({
        title: "Magic created! ✨",
        description: "I've made something special for you!",
        className: "bg-primary text-white"
      });
    }
  } catch (error) {
    console.error('Error in handleImageBlock:', error);
    toast({
      title: "Oops!",
      description: "I couldn't create an image right now. Let's try again!",
      variant: "destructive"
    });
  }
};

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const prompt = block.metadata.prompt || `Create an engaging educational quiz about ${block.title}`;
    console.log('Generating quiz with prompt:', prompt);

    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: prompt,
        age,
        contextualPrompt: `Create fun, engaging, and age-appropriate quiz questions about ${block.title.replace('🎯', '').trim()} 
        that will help a ${age}-year-old learn while having fun!`
      }
    });

    if (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }

    console.log('Quiz generation response:', data);

    if (data?.questions) {
      // Dispatch event to show the quiz in chat
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: `Let's have some fun testing what you know about ${block.title.replace('🎯', '').trim()}! Ready to become a quiz champion? 🌟`,
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
        description: "Let's see how much you know!",
        className: "bg-primary text-white"
      });
    }
  } catch (error) {
    console.error('Error in handleQuizBlock:', error);
    toast({
      title: "Oops!",
      description: "I couldn't create a quiz right now. Let's try again!",
      variant: "destructive"
    });
  }
};