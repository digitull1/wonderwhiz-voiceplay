import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const handleImageBlock = async (block: Block) => {
  console.log('Handling image block:', block);
  
  try {
    const prompt = block.metadata.prompt || block.title;
    console.log('Generating image with prompt:', prompt);

    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt,
        age_group: "8-12" // Default age group if not specified
      }
    });

    if (error) {
      console.error('Error generating image:', error);
      throw error;
    }

    console.log('Image generation response:', data);

    if (data?.image) {
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: `Here's what I imagined for "${block.title.replace('🎨', '').trim()}"! What do you think? ✨`,
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
    const prompt = block.metadata.prompt || block.title;
    console.log('Generating quiz with prompt:', prompt);

    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: prompt,
        age,
        contextualPrompt: `Create ${age}-appropriate quiz questions about ${block.title.replace('🎯', '').trim()}. 
        Make them fun, engaging, and educational!`
      }
    });

    if (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }

    console.log('Quiz generation response:', data);

    if (data?.questions) {
      const event = new CustomEvent('wonderwhiz:newMessage', {
        detail: {
          text: `Let's test what you know about ${block.title.replace('🎯', '').trim()}! 🎯`,
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