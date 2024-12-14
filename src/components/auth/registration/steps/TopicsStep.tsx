import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TopicsStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

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

export function TopicsStep({ form, onNext, onBack }: TopicsStepProps) {
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
    form.setValue("topics", selectedTopics);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-4"
    >
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

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </motion.div>
  );
}