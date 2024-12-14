import React, { useState } from "react";
import { ParentDetailsStep } from "./steps/ParentDetailsStep";
import { ChildDetailsStep } from "./steps/ChildDetailsStep";
import { TopicsStep } from "./steps/TopicsStep";
import { LanguageStep } from "./steps/LanguageStep";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

const formSchema = z.object({
  parentEmail: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  childName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 4 && num <= 12;
  }, "Age must be between 4 and 12"),
  gender: z.enum(["boy", "girl", "other"]),
  language: z.string().min(2, "Please select a language"),
  topics: z.array(z.string()).min(1, "Please select at least one topic"),
});

interface RegistrationStepsProps {
  onComplete: () => void;
}

export function RegistrationSteps({ onComplete }: RegistrationStepsProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentEmail: "",
      password: "",
      childName: "",
      age: "",
      gender: "other",
      language: "en",
      topics: [],
    },
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleRegistrationComplete = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.parentEmail,
        password: values.password,
        options: {
          data: {
            name: values.childName,
            age: parseInt(values.age),
            gender: values.gender,
            language: values.language,
            topics_of_interest: values.topics
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        try {
          const { data: welcomeData, error: welcomeError } = await supabase.functions.invoke('generate-with-gemini', {
            body: {
              prompt: `Generate a friendly, encouraging welcome message for a ${values.age} year old child named ${values.childName} who just joined our educational platform. Keep it simple, fun, and include emojis.`,
              context: {
                age: values.age,
                name: values.childName
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
        } catch (error) {
          console.error('Error generating welcome message:', error);
          toast({
            title: "Welcome to WonderWhiz! 🎉",
            description: `You've earned 100 points to start your learning adventure, ${values.childName}! 🚀`,
            className: "bg-primary text-white"
          });
        }

        onComplete();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  };

  const steps = [
    <ParentDetailsStep key="parent" form={form} onNext={nextStep} />,
    <ChildDetailsStep key="child" form={form} onNext={nextStep} onBack={prevStep} />,
    <TopicsStep key="topics" form={form} onNext={nextStep} onBack={prevStep} />,
    <LanguageStep key="language" form={form} onComplete={() => form.handleSubmit(handleRegistrationComplete)()} onBack={prevStep} />,
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