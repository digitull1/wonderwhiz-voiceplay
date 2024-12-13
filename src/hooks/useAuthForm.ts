import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export const useAuthForm = (onComplete?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });

  const validateFormData = (data: typeof formData) => {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }
    
    // Ensure age is a valid number between 4-12 if provided
    if (data.age) {
      const age = parseInt(data.age);
      if (isNaN(age) || age < 4 || age > 12) {
        throw new Error("Age must be between 4 and 12");
      }
    }
  };

  const handleLogin = async () => {
    console.log('Attempting login with:', formData.email);
    try {
      validateFormData(formData);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data?.user) {
        console.log('Login successful:', data.user.id);
        toast({
          title: "Welcome back! 👋",
          description: "Successfully signed in to your account.",
        });
        onComplete?.();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegister = async () => {
    console.log('Starting registration with:', formData.email);
    try {
      validateFormData(formData);

      // Prepare user metadata with proper types
      const metadata = {
        name: formData.name || 'User',
        age: formData.age ? parseInt(formData.age) : 8,
        gender: 'other',
        language: 'en'
      };

      console.log('Registering with metadata:', metadata);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);
        
        // Add a delay to ensure database triggers complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify profile creation
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error verifying profile:', profileError);
        } else {
          console.log('Profile created successfully:', profile);
        }

        triggerCelebration(formData.name || 'User');
        onComplete?.();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCelebration = (name: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: `🎉 Welcome to WonderWhiz, ${name}!`,
      description: "You've earned 100 points to start your learning adventure! 🚀",
      className: "bg-primary text-white"
    });
  };

  return {
    isLoading,
    setIsLoading,
    formData,
    setFormData,
    handleLogin,
    handleRegister,
  };
};