import { Message, UserProfile } from "@/types/chat";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export const generateInitialBlocks = async (age: number): Promise<Block[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-blocks', {
      body: {
        query: `Generate engaging educational topics for a ${age} year old`,
        context: "general education",
        age_group: `${age}-${age + 2}`
      }
    });

    if (error) {
      console.error('Error generating blocks:', error);
      return [];
    }

    const parsedData = typeof data.choices[0].message.content === 'string' 
      ? JSON.parse(data.choices[0].message.content) 
      : data.choices[0].message.content;

    return parsedData.blocks || [];
  } catch (error) {
    console.error('Error in generateInitialBlocks:', error);
    return [];
  }
};

export const handleNameInput = (
  name: string,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  setUserProfile(prev => ({ ...prev, name, age: 0 }));
  setMessages(prev => [
    ...prev,
    { text: name, isAi: false },
    { 
      text: `Awesome, ${name}! How old are you? This helps me tailor everything just for you! 🎯`, 
      isAi: true,
      blocks: []
    }
  ]);
};

export const handleAgeInput = async (
  age: number,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  updateUserProgress: (points: number) => Promise<void>
) => {
  try {
    setUserProfile(prev => ({ ...prev, age }));
    setMessages(prev => [...prev, { text: age.toString(), isAi: false }]);

    const welcomeBlocks = await generateInitialBlocks(age);
    console.log('Generated welcome blocks:', welcomeBlocks);
    
    setMessages(prev => [...prev, {
      text: `Wow! ${age} is a perfect age for amazing discoveries! 🌟 I've got some mind-blowing facts that will blow your socks off! Check these out and click on what interests you the most! 🚀`,
      isAi: true,
      blocks: welcomeBlocks
    }]);

    await updateUserProgress(10);
  } catch (error) {
    console.error('Error in handleAgeInput:', error);
  }
};