import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check - User:', user);
        
        if (!user) {
          console.log('No user found, signing in anonymously...');
          try {
            // Try to sign in with a stored anonymous account first
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
            
            // If no stored account or sign in failed, create a new one
            const email = `${crypto.randomUUID()}@anonymous.wonderwhiz.com`;
            const password = crypto.randomUUID();
            
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
            });
            
            if (error) {
              if (error.status === 429) {
                console.error('Rate limit reached, using local storage only temporarily');
                // Store temporary user ID in localStorage
                localStorage.setItem('tempUserId', crypto.randomUUID());
                return;
              }
              throw error;
            }
            
            // Store credentials for future sessions
            localStorage.setItem('anonymousEmail', email);
            localStorage.setItem('anonymousPassword', password);
            
            console.log('Signed up anonymously successfully:', data);
            setIsAuthenticated(true);
          } catch (signUpError) {
            console.error('Error signing up anonymously:', signUpError);
            toast({
              title: "Authentication Notice",
              description: "Using temporary mode. Your progress will be saved when connection is restored.",
              variant: "default"
            });
          }
        } else {
          console.log('User already authenticated:', user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
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
    tempUserId: localStorage.getItem('tempUserId') 
  };
};