import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
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

const topics = [
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

const languages = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "zh", label: "Chinese" },
  { value: "de", label: "German" },
];

export function EnhancedRegistrationForm({ onComplete }: { onComplete: () => void }) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
    form.setValue("topics", selectedTopics);
  };

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
            topics_of_interest: selectedTopics
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
  }

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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="parentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent's Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="parent@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Choose a secure password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" min="4" max="12" placeholder="Your age (4-12)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="boy" id="boy" />
                      <label htmlFor="boy">Boy</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="girl" id="girl" />
                      <label htmlFor="girl">Girl</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="other">Other</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topics"
            render={() => (
              <FormItem>
                <FormLabel>Topics of Interest</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Start Your Adventure! 🚀
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}