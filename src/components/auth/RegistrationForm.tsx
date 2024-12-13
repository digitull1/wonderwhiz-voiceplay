import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { ParentForm } from "./registration/ParentForm";
import { ChildForm } from "./registration/ChildForm";
import { Loader2 } from "lucide-react";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.name || !formData.age) {
      toast({
        title: "Missing Information",
        description: "Please provide your child's name and age",
        variant: "destructive"
      });
      return false;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 4 || age > 12) {
      toast({
        title: "Invalid Age",
        description: "Age must be between 4 and 12 years",
        variant: "destructive"
      });
      return false;
    }

    return true;
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // First check if user exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (existingUser.user) {
        toast({
          title: "Account Already Exists",
          description: "Please sign in instead",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Proceed with signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: parseInt(formData.age),
            gender: 'other', // Default value
            language: 'en'   // Default value
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (signUpData.user) {
        // Wait a moment for the trigger functions to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            age: parseInt(formData.age),
            topics_of_interest: selectedTopics
          })
          .eq('id', signUpData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }

        triggerCelebration(formData.name);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="parent-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ParentForm
              email={formData.email}
              password={formData.password}
              onEmailChange={(value) => setFormData({ ...formData, email: value })}
              onPasswordChange={(value) => setFormData({ ...formData, password: value })}
              onNext={() => setStep(2)}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="child-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ChildForm
              name={formData.name}
              age={formData.age}
              selectedTopics={selectedTopics}
              onNameChange={(value) => setFormData({ ...formData, name: value })}
              onAgeChange={(value) => setFormData({ ...formData, age: value })}
              onTopicToggle={handleTopicToggle}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};