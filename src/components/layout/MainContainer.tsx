import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { AuthOverlay } from "./AuthOverlay";
import { TopNavigation } from "./TopNavigation";
import { UserProgress } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { generateInitialBlocks } from "@/utils/profileUtils";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainContainerProps {
  messages: any[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  currentTopic: string;
  handleListen: (text: string) => void;
  handleBlockClick: (block: any) => void;
  handleQuizAnswer: (isCorrect: boolean) => void;
  quizState: any;
  sendMessage: (message: string) => void;
  handleImageAnalysis: (response: string) => void;
  isAuthenticated: boolean;
  userProgress: UserProgress;
  onLogout: () => void;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  messages,
  input,
  setInput,
  isLoading,
  currentTopic,
  handleListen,
  handleBlockClick,
  handleQuizAnswer,
  quizState,
  sendMessage,
  handleImageAnalysis,
  isAuthenticated,
  userProgress,
  onLogout
}) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profile);
      if (profile?.preferred_language) {
        setLanguage(profile.preferred_language);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getWelcomeMessage = () => {
    if (!isAuthenticated) {
      return {
        text: "Hi! I'm WonderWhiz! Your friendly AI Assistant! Please login or register to continue 😊",
        isAi: true,
        showAuthPrompt: true
      };
    }

    const name = profile?.name || "friend";
    const interests = profile?.topics_of_interest || [];
    const interestText = interests.length > 0
      ? `I see you're interested in ${interests.join(", ")}! Let's explore those topics together!`
      : "Let's explore some exciting topics together!";

    return {
      text: `Welcome back, ${name}! 🌟 ${interestText} What would you like to learn about today?`,
      isAi: true,
      blocks: generateInitialBlocks(profile?.age || 8)
    };
  };

  // Only show welcome message if there are no other messages
  const welcomeMessage = getWelcomeMessage();
  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <motion.div 
      className="h-[100dvh] w-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="main"
      aria-label="WonderWhiz Chat Interface"
    >
      <div className="absolute inset-0 bg-gradient-luxury opacity-50" />
      <div className="fixed inset-0 bg-stars opacity-10 animate-float" />
      <div className="fixed inset-0 backdrop-blur-[100px]" />
      
      <div className="relative z-10 flex flex-col h-[100dvh] w-full">
        <TopNavigation 
          isAuthenticated={isAuthenticated}
          onPanelToggle={() => setIsPanelOpen(!isPanelOpen)}
          onLogout={onLogout}
          onAuthClick={(isLogin) => {
            setShowLogin(isLogin);
            setShowAuthForm(true);
          }}
        />

        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          <TooltipProvider>
            <ChatContainer 
              messages={displayMessages}
              handleListen={handleListen}
              onBlockClick={handleBlockClick}
              quizState={quizState}
              onQuizAnswer={handleQuizAnswer}
              onAuthPromptClick={() => setShowAuthForm(true)}
            />
          </TooltipProvider>

          <AnimatePresence>
            {showAuthForm && (
              <AuthOverlay 
                showLogin={showLogin}
                onClose={() => setShowAuthForm(false)}
              />
            )}
          </AnimatePresence>

          <ChatInput 
            onSend={sendMessage}
            isLoading={isLoading}
            input={input}
            setInput={setInput}
            onImageAnalyzed={handleImageAnalysis}
            placeholder="Ask me something magical..."
            language={language}
          />
        </div>
      </div>

      <CollapsiblePanel 
        userProgress={userProgress} 
        onLogout={onLogout}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </motion.div>
  );
};

export default MainContainer;