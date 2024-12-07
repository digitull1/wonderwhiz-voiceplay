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
          const { data, error } = await supabase.auth.signUp({
            email: `${crypto.randomUUID()}@anonymous.wonderwhiz.com`,
            password: crypto.randomUUID(),
          });
          
          if (error) {
            console.error('Error signing in anonymously:', error);
            toast({
              title: "Authentication Error",
              description: "There was an issue signing you in. Some features might be limited.",
              variant: "destructive"
            });
          } else {
            console.log('Signed in anonymously successfully:', data);
            setIsAuthenticated(true);
          }
        } else {
          console.log('User already authenticated:', user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        toast({
          title: "Authentication Error",
          description: "There was an issue with authentication. Some features might be limited.",
          variant: "destructive"
        });
      }
    };

    checkAuth();
  }, [toast]);

  return { isAuthenticated };
};