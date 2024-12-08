import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";
import { ParentForm } from "./registration/ParentForm";
import { ChildForm } from "./registration/ChildForm";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
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
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            age: parseInt(formData.age),
            topics_of_interest: selectedTopics
          })
          .eq('id', signUpData.user.id);

        if (profileError) throw profileError;

        triggerCelebration(formData.name);
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6"
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};