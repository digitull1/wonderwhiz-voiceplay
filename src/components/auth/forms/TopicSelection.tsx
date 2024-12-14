import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TopicSelectionProps {
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
  disabled?: boolean;
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

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  selectedTopics,
  onTopicToggle,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <Label>Topics of Interest</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {topics.map((topic) => (
          <Button
            key={topic.id}
            type="button"
            variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
            className={cn(
              "h-auto py-2 px-3 text-left flex items-center gap-2",
              "transition-all duration-200 ease-in-out"
            )}
            onClick={() => onTopicToggle(topic.id)}
            disabled={disabled}
          >
            <span>{topic.emoji}</span>
            <span className="text-sm">{topic.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};