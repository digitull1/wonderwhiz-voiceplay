import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  age: string;
  language: string;
  topics: string[];
}

const topics = [
  { id: 'space', name: 'Space & Astronomy', emoji: '🌌' },
  { id: 'ocean', name: 'Ocean & Marine Life', emoji: '🐳' },
  { id: 'dinosaurs', name: 'Dinosaurs & Fossils', emoji: '🦖' },
  { id: 'math', name: 'Math & Puzzles', emoji: '📐' },
  { id: 'animals', name: 'Animals & Nature', emoji: '🦁' },
  { id: 'art', name: 'Art & Creativity', emoji: '🎨' },
  { id: 'sports', name: 'Sports & Fitness', emoji: '⚽' },
  { id: 'geography', name: 'Geography & Cultures', emoji: '🌍' },
  { id: 'tech', name: 'Inventions & Technology', emoji: '🚀' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'zh', label: 'Chinese' },
  { value: 'de', label: 'German' },
];

export const RegistrationSteps = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    name: '',
    age: '',
    language: 'en',
    topics: [],
  });
  const { toast } = useToast();

  const handleTopicToggle = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: parseInt(formData.age),
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
            language: formData.language,
            topics_of_interest: formData.topics
          })
          .eq('id', signUpData.user.id);

        if (profileError) throw profileError;

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: "🎉 Welcome to WonderWhiz!",
          description: "You've earned 100 points to start your learning adventure! 🚀",
          className: "bg-primary text-white"
        });
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
    <AnimatePresence mode="wait">
      {step === 1 ? (
        <motion.div
          key="parent-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Parent's Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button 
            onClick={() => setStep(2)}
            className="w-full"
          >
            Next
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="child-form"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="4"
                max="12"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Language Preference</Label>
              <Select 
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topics of Interest</Label>
            <div className="grid grid-cols-2 gap-2">
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  type="button"
                  variant={formData.topics.includes(topic.id) ? "default" : "outline"}
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
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
            >
              Complete Registration
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};