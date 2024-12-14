import React, { useState } from "react";
import { ParentDetailsStep } from "./steps/ParentDetailsStep";
import { ChildDetailsStep } from "./steps/ChildDetailsStep";
import { TopicsStep } from "./steps/TopicsStep";
import { LanguageStep } from "./steps/LanguageStep";
import { motion, AnimatePresence } from "framer-motion";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RegistrationStepsProps {
  onComplete: () => void;
}

export function RegistrationSteps({ onComplete }: RegistrationStepsProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const form = useRegistrationForm(onComplete);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    <ParentDetailsStep key="parent" form={form} onNext={nextStep} />,
    <ChildDetailsStep key="child" form={form} onNext={nextStep} onBack={prevStep} />,
    <TopicsStep key="topics" form={form} onNext={nextStep} onBack={prevStep} />,
    <LanguageStep key="language" form={form} onComplete={onComplete} onBack={prevStep} />,
  ];

  return (
    <motion.div
      className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Join WonderWhiz! 🌟</h1>
        <p className="text-gray-500">Let's create your magical learning account</p>
      </div>
      
      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>
    </motion.div>
  );
}