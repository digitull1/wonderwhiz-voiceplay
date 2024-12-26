import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";

interface AuthFormProps {
  onComplete?: () => void;
}

export const AuthForm = ({ onComplete }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting registration/login process...");

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInData?.user) {
        console.log('User exists, signed in successfully');
        toast({
          title: "Welcome back! 👋",
          description: "Successfully signed in to your account.",
        });
        onComplete?.();
        return;
      }

      // If sign in fails, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: parseInt(formData.age),
          },
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          toast({
            title: "Account exists",
            description: "Please try signing in instead.",
            variant: "destructive"
          });
        } else {
          throw signUpError;
        }
        return;
      }

      if (signUpData.user) {
        console.log("User created successfully:", signUpData.user.id);
        triggerCelebration(formData.name);
        onComplete?.();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to WonderWhiz! 🌟</h2>
            <p className="text-gray-600 mt-2">Let's create your magical learning account</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Parent's Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="parent@example.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Choose a secure password"
                className="mt-1"
                minLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="4"
                max="12"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                placeholder="Your age (4-12)"
                className="mt-1"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating your magical account..." : "Start Your Adventure!"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};