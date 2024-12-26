import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check - User:', user);
        
        if (!user) {
          console.log('No user found, trying stored credentials...');
          try {
            // Try to sign in with stored credentials first
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
                return;
              }
            }
            
            // If no stored credentials or sign in failed, create new account
            const email = `${crypto.randomUUID()}@anonymous.wonderwhiz.com`;
            const password = crypto.randomUUID();
            
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
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
        } else {
          console.log('User already authenticated:', user);
          setIsAuthenticated(true);
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
      }
    };

    checkAuth();
  }, [toast]);

  return { 
    isAuthenticated,
    tempUserId 
  };
};