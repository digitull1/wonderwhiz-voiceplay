import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WelcomeStep } from "./steps/WelcomeStep";
import { InterestsStep } from "./steps/InterestsStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegistrationStepsProps {
  onComplete: () => void;
}

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          topics_of_interest: selectedTopics
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: onboardingError } = await supabase
        .from('onboarding_state')
        .update({
          completed_steps: ['welcome', 'topics', 'preferences'],
          learning_preferences: {
            style: learningStyle,
            pace: "moderate",
            format: "interactive"
          }
        })
        .eq('user_id', user.id);

      if (onboardingError) throw onboardingError;

      toast({
        title: "Setup Complete! 🎉",
        description: "Your magical learning journey begins now!",
        className: "bg-primary text-white"
      });

      onComplete();
    } catch (error) {
      console.error('Error completing registration:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <WelcomeStep
            key="welcome"
            onNext={handleNext}
            isLoading={isLoading}
          />
        )}
        {currentStep === 1 && (
          <InterestsStep
            key="interests"
            selectedTopics={selectedTopics}
            onTopicToggle={handleTopicToggle}
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
        {currentStep === 2 && (
          <PreferencesStep
            key="preferences"
            learningStyle={learningStyle}
            onStyleChange={setLearningStyle}
            onNext={handleComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};