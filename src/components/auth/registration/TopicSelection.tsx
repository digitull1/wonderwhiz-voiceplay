import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  name: string;
  emoji: string;
}

interface TopicSelectionProps {
  selectedTopics: string[];
  onTopicToggle: (topicId: string) => void;
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

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  selectedTopics,
  onTopicToggle,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Topics of Interest</label>
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
          >
            <span>{topic.emoji}</span>
            <span className="text-sm">{topic.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};