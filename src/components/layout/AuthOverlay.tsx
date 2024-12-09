import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface AuthOverlayProps {
  showLogin: boolean;
  onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ showLogin, onClose }) => {
  const { toast } = useToast();

  const handleAuthSuccess = async (session: Session | null) => {
    if (session?.user) {
      try {
        await ensureUserProgress(session.user.id);
        toast({
          title: "Welcome to WonderWhiz! 🌟",
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
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingProgress && !fetchError) {
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([{ 
            user_id: userId,
            points: 100,
            level: 1,
            streak_days: 0,
            topics_explored: 0,
            questions_asked: 0,
            quiz_score: 0
          }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error in ensureUserProgress:', error);
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        await handleAuthSuccess(session);
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
        className="bg-gradient-luxury rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 relative border border-white/20"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white
            w-8 h-8 flex items-center justify-center rounded-full
            hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {showLogin ? "Welcome Back! ✨" : "Join the Adventure! 🚀"}
            </h2>
            <p className="text-gray-300">
              {showLogin 
                ? "Continue your magical learning journey" 
                : "Create your account and start exploring"}
            </p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    inputBackground: 'white',
                    inputText: '#1A1F2C',
                    inputPlaceholder: '#666',
                    messageText: 'white',
                    messageTextDanger: '#ff4b4b',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label text-white',
                message: 'auth-message',
              },
            }}
            theme="dark"
            providers={[]}
            view={showLogin ? "sign_in" : "sign_up"}
            redirectTo={window.location.origin}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};