import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Session } from "@supabase/supabase-js";

interface AuthOverlayProps {
  showLogin: boolean;
  onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ showLogin, onClose }) => {
  const { toast } = useToast();

  const handleAuthSuccess = async (session: Session | null) => {
    console.log('Auth success:', { session });
    
    if (session?.user) {
      try {
        await ensureUserProgress(session.user.id);
        
        toast({
          title: "Welcome to WonderWhiz!",
          description: "Successfully signed in.",
        });
        onClose();
      } catch (error) {
        console.error('Error in auth success:', error);
        toast({
          title: "Error",
          description: "There was an error setting up your account. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const ensureUserProgress = async (userId: string) => {
    try {
      console.log('Checking user progress for:', userId);
      
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Progress check result:', { existingProgress, fetchError });

      if (!existingProgress) {
        console.log('No progress found, creating new progress record');
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([
            { 
              user_id: userId,
              points: 100,
              level: 1,
              streak_days: 0,
              topics_explored: 0,
              questions_asked: 0,
              quiz_score: 0
            }
          ]);

        if (insertError) {
          console.error('Error creating user progress:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error in ensureUserProgress:', error);
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        handleAuthSuccess(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700
            w-8 h-8 flex items-center justify-center rounded-full
            hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {showLogin ? "Welcome Back!" : "Join WonderWhiz"}
          </h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            view={showLogin ? "sign_in" : "sign_up"}
            redirectTo={window.location.origin}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};