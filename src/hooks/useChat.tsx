import { useState } from "react";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
}

interface UserProfile {
  name: string;
  age: number;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! 👋 I'm Wonder Whiz, your learning buddy! What's your name? 🌟",
      isAi: true,
      blocks: []
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("space");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const getLastAiMessage = (msgs: Message[]): Message | undefined => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].isAi) {
        return msgs[i];
      }
    }
    return undefined;
  };

  const handleListen = () => {
    const lastAiMessage = getLastAiMessage(messages);
    if (!lastAiMessage) return;

    const utterance = new SpeechSynthesisUtterance(lastAiMessage.text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);

    toast({
      title: "Reading message...",
      description: "Click anywhere to stop",
    });
  };

  const handleBlockClick = async (block: Block) => {
    setCurrentTopic(block.metadata.topic);
    await sendMessage(`Tell me about ${block.title}!`);
  };

  const handleNameInput = (name: string) => {
    setUserProfile(prev => ({ ...prev, name } as UserProfile));
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

  const handleAgeInput = (age: number) => {
    setUserProfile(prev => ({ ...prev, age } as UserProfile));
    setMessages(prev => [
      ...prev,
      { text: age.toString(), isAi: false },
      { 
        text: `Great to meet you${userProfile?.name ? `, ${userProfile.name}` : ''}! I'll make sure to make our learning adventure perfect for a ${age} year old explorer! What would you like to learn about? 🚀`,
        isAi: true,
        blocks: [
          {
            title: "Space Exploration 🚀",
            description: "Discover the mysteries of the universe!",
            metadata: { topic: "space" }
          },
          {
            title: "Animal Kingdom 🦁",
            description: "Learn about amazing creatures!",
            metadata: { topic: "animals" }
          },
          {
            title: "Science Lab 🧪",
            description: "Explore exciting experiments!",
            metadata: { topic: "science" }
          }
        ]
      }
    ]);
  };

  const generateDynamicBlocks = async (response: string, topic: string) => {
    try {
      const { data } = await supabase.functions.invoke('generate-blocks', {
        body: {
          query: response,
          context: topic,
          age_group: userProfile ? `${userProfile.age}-${userProfile.age + 2}` : "8-12",
          name: userProfile?.name
        }
      });

      if (data?.choices?.[0]?.message?.content) {
        const parsedData = typeof data.choices[0].message.content === 'string' 
          ? JSON.parse(data.choices[0].message.content) 
          : data.choices[0].message.content;

        return parsedData.blocks.map((block: Block) => ({
          ...block,
          description: block.description.split('.')[0] + '.' // Keep only first sentence
        }));
      }
      return [];
    } catch (error) {
      console.error('Error generating blocks:', error);
      return [];
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    if (!userProfile?.name) {
      handleNameInput(messageText);
      return;
    }

    if (!userProfile?.age) {
      const age = parseInt(messageText);
      if (isNaN(age) || age < 5 || age > 16) {
        setMessages(prev => [
          ...prev,
          { text: messageText, isAi: false },
          { text: "Please enter a valid age between 5 and 16! 🎈", isAi: true, blocks: [] }
        ]);
        return;
      }
      handleAgeInput(age);
      return;
    }

    setMessages(prev => [...prev, { text: messageText, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqResponse(messageText);
      const aiMessage = { text: response, isAi: true, blocks: [] };
      
      const blocks = await generateDynamicBlocks(response, currentTopic);
      if (blocks) {
        aiMessage.blocks = blocks;
      }
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = (response: string) => {
    setMessages(prev => [
      ...prev,
      { text: "I uploaded an image! 📸", isAi: false },
      { text: response, isAi: true }
    ]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    handleListen,
    handleBlockClick,
    sendMessage,
    handleImageAnalysis
  };
};