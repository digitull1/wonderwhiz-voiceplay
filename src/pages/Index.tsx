import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { MainContainer } from "@/components/layout/MainContainer";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { useChat } from "@/hooks/useChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";

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
    return (
      <motion.div 
        className="min-h-screen gradient-bg flex flex-col items-center justify-center relative overflow-hidden p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to WonderWhiz! 🌟</h1>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              const name = formData.get('name') as string;
              const age = formData.get('age') as string;

              try {
                const { error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      name,
                      age: parseInt(age),
                    },
                  },
                });
                if (error) throw error;
              } catch (error: any) {
                console.error('Error:', error.message);
                // If user exists, try to sign in
                if (error.message.includes('already registered')) {
                  const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                  });
                  if (signInError) throw signInError;
                }
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Choose a password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    name="age"
                    type="number"
                    required
                    min="4"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your age"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Start Learning!
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
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

          <div aria-hidden="true">
            <motion.div 
              className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-primary/30 rounded-full 
                filter blur-[100px] opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/30 rounded-full 
                filter blur-[100px] opacity-50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;