import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('User authenticated:', session.user.id);
          setIsAuthenticated(true);
        } else {
          console.log('No authenticated session found');
          // Set up temporary ID for anonymous users
          const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
          setTempUserId(tempId);
          localStorage.setItem('tempUserId', tempId);
          
          toast({
            title: "Welcome to WonderWhiz!",
            description: "Sign in or register to save your progress and unlock all features.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        // Fallback to temporary ID
        const tempId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        setTempUserId(tempId);
        localStorage.setItem('tempUserId', tempId);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
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
    isLoading,
    tempUserId 
  };
};