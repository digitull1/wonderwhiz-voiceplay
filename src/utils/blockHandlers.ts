import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const handleContentBlock = async (block: Block, age: number) => {
  console.log('Handling content block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
      body: { 
        prompt: `Generate fun, engaging content for kids aged ${age} on the topic: "${block.title}". Include a hook, an explanation, and a follow-up question. Max 150 words.`,
        context: {
          age,
          topic: block.metadata.topic
        }
      }
    });

    if (error) throw error;

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: data.text,
        isAi: true,
        blocks: await generateRelatedBlocks(block.metadata.topic, age)
      }
    }));

    toast({
      title: "✨ Let's explore!",
      description: "Here's something interesting about " + block.title,
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleContentBlock:', error);
    handleError("Couldn't generate content right now");
  }
};

export const handleImageBlock = async (block: Block) => {
  console.log('Handling image block:', block);
  
  try {
    const safePrompt = `Generate a kid-friendly, cartoon-style image related to the topic: "${block.title}". Keep it colorful and engaging.`;
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt: safePrompt }
    });

    if (error) throw error;

    if (!data?.image) {
      throw new Error('No image data received');
    }

    window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
      detail: {
        text: `I've created this special illustration about "${block.title}"! What interesting things can you spot in this picture? Let's explore what we can learn from it! ✨`,
        isAi: true,
        imageUrl: data.image
      }
    }));

    toast({
      title: "Magic created! ✨",
      description: "I've made something special for you!",
      className: "bg-primary text-white"
    });
  } catch (error) {
    console.error('Error in handleImageBlock:', error);
    handleError("Couldn't create an image right now");
  }
};

export const handleQuizBlock = async (block: Block, age: number) => {
  console.log('Handling quiz block:', block);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { 
        topic: block.title,
        age,
        contextualPrompt: `Generate a multiple-choice quiz for kids aged ${age} on the topic: "${block.title}".
        Include:
        - Question: 1 sentence
        - 3 Options (1 correct, 2 silly distractors)
        - Correct/Incorrect feedback`
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

const generateRelatedBlocks = async (topic: string, age: number): Promise<Block[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-blocks', {
      body: {
        query: topic,
        context: topic,
        age_group: `${age}-${age + 2}`
      }
    });

    if (error) throw error;

    // Ensure we have exactly 5 blocks with the correct types
    const blocks = data.blocks.slice(0, 3); // First 3 for content
    
    // Add image block
    blocks.push({
      title: `🎨 Create amazing art about ${topic}!`,
      description: "Let's make something creative",
      metadata: {
        topic,
        type: "image",
        prompt: `Create a fun, educational illustration about ${topic}`
      }
    });

    // Add quiz block
    blocks.push({
      title: `🎯 Test your ${topic} knowledge!`,
      description: "Are you ready for a challenge?",
      metadata: {
        topic,
        type: "quiz",
        prompt: `Generate engaging quiz questions about ${topic}`
      }
    });

    return blocks;
  } catch (error) {
    console.error('Error generating related blocks:', error);
    return getFallbackBlocks(topic);
  }
};

const getFallbackBlocks = (topic: string): Block[] => {
  return [
    {
      title: `🌟 Discover amazing facts about ${topic}!`,
      description: "Click to learn more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `💡 Explore interesting ideas about ${topic}!`,
      description: "Click to discover more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `🔍 Investigate the secrets of ${topic}!`,
      description: "Click to uncover more",
      metadata: {
        topic,
        type: "fact"
      }
    },
    {
      title: `🎨 Create amazing art about ${topic}!`,
      description: "Let's make something creative",
      metadata: {
        topic,
        type: "image"
      }
    },
    {
      title: `🎯 Test your ${topic} knowledge!`,
      description: "Ready for a challenge?",
      metadata: {
        topic,
        type: "quiz"
      }
    }
  ];
};

const handleError = (message: string) => {
  window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
    detail: {
      text: "Oops! " + message + ". Let's try something else! ✨",
      isAi: true
    }
  }));

  toast({
    title: "Oops!",
    description: message,
    variant: "destructive"
  });
};