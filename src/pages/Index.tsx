import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { MainContainer } from "@/components/layout/MainContainer";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { useChat } from "@/hooks/useChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";
import { WelcomeContainer } from "@/components/auth/WelcomeContainer";

const Index = () => {
  const [session, setSession] = React.useState<any>(null);
  const [showProfileForm, setShowProfileForm] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowProfileForm(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    messages,
    input,
    setInput,
    isLoading,
    currentTopic,
    userProgress,
    handleListen,
    handleBlockClick,
    handleQuizAnswer,
    quizState,
    sendMessage,
    handleImageAnalysis
  } = useChat();

  if (!session) {
    return <WelcomeContainer />;
  }

  if (showProfileForm) {
    return <ProfileForm onComplete={() => setShowProfileForm(false)} />;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen gradient-bg flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="main"
        aria-label="WonderWhiz Chat Interface"
      >
        <TooltipProvider>
          <CollapsiblePanel 
            userProgress={userProgress}
            aria-label="User Progress Panel"
          />

          <BackgroundDecorations />

          <MainContainer 
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            currentTopic={currentTopic}
            handleListen={handleListen}
            handleBlockClick={handleBlockClick}
            handleQuizAnswer={handleQuizAnswer}
            quizState={quizState}
            sendMessage={sendMessage}
            handleImageAnalysis={handleImageAnalysis}
          />
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;