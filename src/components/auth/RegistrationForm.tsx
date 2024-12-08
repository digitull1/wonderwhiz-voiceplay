import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";

interface Topic {
  id: string;
  name: string;
  emoji: string;
}

const topics: Topic[] = [
  { id: "space", name: "Space & Astronomy", emoji: "🌌" },
  { id: "ocean", name: "Ocean & Marine Life", emoji: "🐳" },
  { id: "dinosaurs", name: "Dinosaurs & Fossils", emoji: "🦖" },
  { id: "math", name: "Math & Puzzles", emoji: "📐" },
  { id: "animals", name: "Animals & Nature", emoji: "🦁" },
  { id: "art", name: "Art & Creativity", emoji: "🎨" },
  { id: "sports", name: "Sports & Fitness", emoji: "⚽" },
  { id: "geography", name: "Geography & Cultures", emoji: "🌍" },
  { id: "tech", name: "Inventions & Technology", emoji: "🚀" },
];

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

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
          <motion.form
            key="step1"
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            
            <div className="space-y-2">
              <Label htmlFor="email">Parent's Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="parent@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Choose a secure password"
              />
            </div>

            <Button type="submit" className="w-full">Next</Button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-center">Child's Profile</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Child's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                required
                min="4"
                max="12"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age (4-12)"
              />
            </div>

            <div className="space-y-2">
              <Label>Topics of Interest</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.id}
                    type="button"
                    variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                    className="h-auto py-2 px-3 text-left flex items-center gap-2"
                    onClick={() => handleTopicToggle(topic.id)}
                  >
                    <span>{topic.emoji}</span>
                    <span className="text-sm">{topic.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Complete Registration
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};