import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const retryWithBackoff = async (fn: () => Promise<any>, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authCheck = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          console.log('Auth check - User:', user);
          return user;
        };

        const user = await retryWithBackoff(authCheck);
        
        if (user) {
          console.log('User authenticated:', user.id);
          setIsAuthenticated(true);
          return;
        }

        // If no user is found, set up temporary ID
        console.log('No authenticated user found');
        const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        setTempUserId(tempId);
        localStorage.setItem('tempUserId', tempId);
        
        // Show a gentle reminder to sign in
        toast({
          title: "Welcome to WonderWhiz!",
          description: "Sign in or register to save your progress and unlock all features.",
          variant: "default"
        });

      } catch (error) {
        console.error('Error in checkAuth:', error);
        // Fallback to temporary ID
        const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        setTempUserId(tempId);
        localStorage.setItem('tempUserId', tempId);
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        const tempId = crypto.randomUUID();
        setTempUserId(tempId);
        localStorage.setItem('tempUserId', tempId);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { 
    isAuthenticated,
    tempUserId 
  };
};