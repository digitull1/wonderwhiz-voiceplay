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

  const generateDynamicBlocks = async (response: string, topic: string) => {
    try {
      console.log("Generating blocks for topic:", topic);
      const { data } = await supabase.functions.invoke('generate-blocks', {
        body: {
          query: response,
          context: topic,
          age_group: userProfile ? `${userProfile.age}-${userProfile.age + 2}` : "8-12",
          name: userProfile?.name
        }
      });

      console.log("Generated blocks data:", data);

      if (data?.choices?.[0]?.message?.content) {
        const parsedData = typeof data.choices[0].message.content === 'string' 
          ? JSON.parse(data.choices[0].message.content) 
          : data.choices[0].message.content;

        console.log("Parsed blocks:", parsedData.blocks);
        return parsedData.blocks;
      }
      return [];
    } catch (error) {
      console.error('Error generating blocks:', error);
      return [];
    }
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
      console.log("Sending message:", messageText);
      const response = await getGroqResponse(messageText);
      console.log("Received response:", response);
      
      const blocks = await generateDynamicBlocks(response, currentTopic);
      console.log("Generated blocks:", blocks);
      
      const aiMessage = { 
        text: response, 
        isAi: true, 
        blocks: blocks 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "New knowledge unlocked! 🎉",
        description: "Keep exploring to earn more rewards!",
        className: "bg-primary text-white",
      });
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
    handleListen: () => {}, // Placeholder for voice feature
    handleBlockClick: (block: Block) => {
      setCurrentTopic(block.metadata.topic);
      sendMessage(`Tell me about ${block.title}!`);
    },
    sendMessage,
    handleImageAnalysis
  };
};