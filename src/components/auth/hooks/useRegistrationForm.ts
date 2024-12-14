import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";

interface FormData {
  email: string;
  password: string;
  name: string;
  age: string;
  language: string;
}

export const useRegistrationForm = (onComplete?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    age: "",
    language: "en"
  });
  const { toast } = useToast();

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: parseInt(formData.age),
            language: formData.language,
            topics_of_interest: selectedTopics
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Trigger celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: `🎉 Welcome to WonderWhiz, ${formData.name}!`,
          description: "You've earned 100 points to start your learning adventure! 🚀",
          className: "bg-primary text-white"
        });

        onComplete?.();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedTopics,
    handleTopicToggle,
    isLoading,
    handleSubmit
  };
};