import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { RegistrationSteps } from "./registration/RegistrationSteps";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

export function EnhancedRegistrationForm({ onComplete }: { onComplete: () => void }) {
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

  const triggerCelebration = async (name: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      const { data: welcomeData, error: welcomeError } = await supabase.functions.invoke('generate-with-gemini', {
        body: {
          prompt: `Generate a friendly, encouraging welcome message for a ${form.getValues("age")} year old child named ${name} who just joined our educational platform. Keep it simple, fun, and include emojis.`,
          context: {
            age: form.getValues("age"),
            name: name
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
        description: `You've earned 100 points to start your learning adventure, ${name}! 🚀`,
        className: "bg-primary text-white"
      });
    }
  };

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
        await triggerCelebration(values.childName);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistrationComplete)}>
        <RegistrationSteps onComplete={onComplete} />
      </form>
    </Form>
  );
}