import React, { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { TopicBlocks } from "@/components/TopicBlocks";
import { VoiceInput } from "@/components/VoiceInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { getGroqResponse } from "@/utils/groq";
import { useToast } from "@/components/ui/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";
import { motion } from "framer-motion";

const Index = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Wonder Whiz, your learning buddy! What would you like to explore today?",
      isAi: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("space");
  const [session, setSession] = useState<any>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkProfile();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("age, gender")
      .single();
    
    setNeedsProfile(!profile?.age || !profile?.gender);
  };

  const detectTopic = (message: string) => {
    const topics = {
      space: ["space", "planet", "star", "galaxy", "astronaut", "rocket", "alien"],
      biology: ["body", "cell", "dna", "brain", "heart", "animal", "plant"],
      earth: ["earth", "volcano", "ocean", "mountain", "weather", "dinosaur"],
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return topic;
      }
    }
    return currentTopic;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isAi: true }]);
      setCurrentTopic(detectTopic(userMessage));
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: string) => {
    const topicQuestions = {
      black_hole_interior: "What's inside a black hole?",
      alien_life: "Are there aliens in space?",
      stellar_death: "How do stars die?",
      // Add more mappings as needed
    };

    const question = topicQuestions[topic as keyof typeof topicQuestions] || `Tell me about ${topic.replace(/_/g, " ")}`;
    setInput(question);
    await handleSend();
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
  };

  const handleListen = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].text);
    synth.speak(utterance);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to WonderWhiz!</h1>
            <p className="text-gray-500">Sign in to start your learning adventure</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            theme="light"
          />
        </div>
      </div>
    );
  }

  if (needsProfile) {
    return <ProfileForm onComplete={() => setNeedsProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-[calc(100vh-4rem)] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                WonderWhiz
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ApiKeyInput />
              <Button
                variant="outline"
                onClick={() => supabase.auth.signOut()}
                className="ml-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isAi={message.isAi}
                onListen={message.isAi ? handleListen : undefined}
              />
            ))}
          </div>
          
          <div className="space-y-6">
            <TopicBlocks currentTopic={currentTopic} onTopicSelect={handleTopicSelect} />
            
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Input
                placeholder={isLoading ? "Thinking..." : "Ask me anything about " + currentTopic + "..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <VoiceInput onVoiceInput={handleVoiceInput} />
              <Button 
                onClick={handleSend} 
                disabled={isLoading} 
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Send className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;