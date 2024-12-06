import { Message, UserProfile } from "@/types/chat";
import { generateInitialBlocks } from "./blockUtils";
import { supabase } from "@/integrations/supabase/client";

export const handleNameInput = (
  name: string,
  setUserProfile: (profile: UserProfile) => void,
  setMessages: (messages: Message[]) => void
) => {
  setUserProfile({ name, age: 0 });
  setMessages(prev => [...prev,
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
  setUserProfile: (profile: UserProfile) => void,
  setMessages: (messages: Message[]) => void,
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