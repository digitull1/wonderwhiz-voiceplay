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
        
        if (user) {
          console.log('User already authenticated:', user);
          setIsAuthenticated(true);
          return;
        }

        // If no user is found, just set up temporary ID
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

    checkAuth();
  }, [toast]);

  return { 
    isAuthenticated,
    tempUserId 
  };
};