import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          console.log('Existing session found:', session);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        console.log('No session found, checking stored credentials...');
        
        try {
          // Try to sign in with stored credentials
          const storedEmail = localStorage.getItem('anonymousEmail');
          const storedPassword = localStorage.getItem('anonymousPassword');
          
          if (storedEmail && storedPassword) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: storedEmail,
              password: storedPassword
            });
            
            if (!error && data.user) {
              console.log('Signed in with stored anonymous account');
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          }
          
          // If no stored credentials or sign in failed, create new account
          const email = `${crypto.randomUUID()}@anonymous.wonderwhiz.com`;
          const password = crypto.randomUUID();
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                anonymous: true
              }
            }
          });
          
          if (error) {
            if (error.status === 429) {
              console.log('Rate limit reached, using local storage only');
              const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
              setTempUserId(tempId);
              localStorage.setItem('tempUserId', tempId);
              toast({
                title: "Notice",
                description: "Using temporary mode. Your progress will be saved locally.",
                variant: "default"
              });
              setIsLoading(false);
              return;
            }
            throw error;
          }
          
          // Store credentials for future sessions
          localStorage.setItem('anonymousEmail', email);
          localStorage.setItem('anonymousPassword', password);
          console.log('Anonymous signup successful');
          setIsAuthenticated(true);
          
        } catch (signUpError) {
          console.error('Error in anonymous auth:', signUpError);
          // Fallback to temporary ID
          const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
          setTempUserId(tempId);
          localStorage.setItem('tempUserId', tempId);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        setTempUserId(tempId);
        localStorage.setItem('tempUserId', tempId);
        toast({
          title: "Authentication Notice",
          description: "Some features might be limited. Don't worry, we'll keep trying to connect!",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    checkAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { 
    isAuthenticated,
    tempUserId,
    isLoading
  };
};