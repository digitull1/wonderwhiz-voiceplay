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

  const handleLogin = async () => {
    console.log('Attempting login with:', formData.email);
    try {
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
      // Add a small delay to ensure database is ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name || 'User',
            age: parseInt(formData.age) || 8,
            gender: 'other',
            language: 'en'
          },
          emailRedirectTo: window.location.origin,
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (signUpData.user) {
        // Wait for trigger functions to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          const { data: welcomeData, error: welcomeError } = await supabase.functions.invoke('generate-with-gemini', {
            body: {
              prompt: `Generate a friendly, encouraging welcome message for a ${formData.age} year old child named ${formData.name} who just joined our educational platform. Keep it simple, fun, and include emojis.`,
              context: {
                age: formData.age,
                name: formData.name
              }
            }
          });

          if (!welcomeError && welcomeData?.text) {
            toast({
              title: "Welcome to WonderWhiz! 🎉",
              description: welcomeData.text,
              className: "bg-primary text-white"
            });
          }
        } catch (geminiError) {
          console.error('Error generating welcome message:', geminiError);
          toast({
            title: "Welcome to WonderWhiz! 🎉",
            description: "You've earned 100 points to start your learning adventure!",
            className: "bg-primary text-white"
          });
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        onComplete?.();
        return true;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
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