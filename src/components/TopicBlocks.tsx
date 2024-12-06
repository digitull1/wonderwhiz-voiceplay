import React from "react";
import { TopicBlock } from "./TopicBlock";
import { Rocket, Microscope, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface TopicBlocksProps {
  currentTopic?: string;
}

export const TopicBlocks: React.FC<TopicBlocksProps> = ({ currentTopic = "space" }) => {
  const { toast } = useToast();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const generateTopicBlocks = (topic: string) => {
    switch (topic.toLowerCase()) {
      case "space":
        return [
          {
            icon: <Rocket className="w-6 h-6 text-white" />,
            title: "What's Inside a Black Hole? 🕳️",
            description: "Discover the mysteries at the center",
            color: "bg-primary text-white",
            onClick: () => handleTopicClick("black_hole_interior"),
          },
          {
            icon: <Rocket className="w-6 h-6 text-white" />,
            title: "How Do Stars Die? 💫",
            description: "The explosive end of stellar life",
            color: "bg-accent text-white",
            onClick: () => handleTopicClick("stellar_death"),
          },
          {
            icon: <Rocket className="w-6 h-6 text-white" />,
            title: "Are We Alone? 👽",
            description: "The search for alien life",
            color: "bg-secondary text-white",
            onClick: () => handleTopicClick("alien_life"),
          },
        ];
      case "biology":
        return [
          {
            icon: <Microscope className="w-6 h-6 text-white" />,
            title: "How Does DNA Work? 🧬",
            description: "Your body's instruction manual",
            color: "bg-primary text-white",
            onClick: () => handleTopicClick("dna_function"),
          },
          {
            icon: <Microscope className="w-6 h-6 text-white" />,
            title: "Why Do We Sleep? 😴",
            description: "The science of rest",
            color: "bg-accent text-white",
            onClick: () => handleTopicClick("sleep_science"),
          },
          {
            icon: <Microscope className="w-6 h-6 text-white" />,
            title: "How Do Vaccines Work? 💉",
            description: "Your body's defense system",
            color: "bg-secondary text-white",
            onClick: () => handleTopicClick("vaccine_science"),
          },
        ];
      case "earth":
        return [
          {
            icon: <Globe className="w-6 h-6 text-white" />,
            title: "Why Do Volcanoes Erupt? 🌋",
            description: "Earth's explosive nature",
            color: "bg-primary text-white",
            onClick: () => handleTopicClick("volcano_eruption"),
          },
          {
            icon: <Globe className="w-6 h-6 text-white" />,
            title: "What Causes Earthquakes? 🌍",
            description: "When the ground shakes",
            color: "bg-accent text-white",
            onClick: () => handleTopicClick("earthquake_science"),
          },
          {
            icon: <Globe className="w-6 h-6 text-white" />,
            title: "How Do Tsunamis Form? 🌊",
            description: "Giant waves explained",
            color: "bg-secondary text-white",
            onClick: () => handleTopicClick("tsunami_formation"),
          },
        ];
      default:
        return [
          {
            icon: <Rocket className="w-6 h-6 text-white" />,
            title: "Explore Space! 🌌",
            description: "Journey to the stars",
            color: "bg-primary text-white",
            onClick: () => handleTopicClick("space"),
          },
          {
            icon: <Microscope className="w-6 h-6 text-white" />,
            title: "Discover Biology! 🔬",
            description: "Learn about life",
            color: "bg-accent text-white",
            onClick: () => handleTopicClick("biology"),
          },
          {
            icon: <Globe className="w-6 h-6 text-white" />,
            title: "Earth Science! 🌍",
            description: "Our planet's secrets",
            color: "bg-secondary text-white",
            onClick: () => handleTopicClick("earth"),
          },
        ];
    }
  };

  const handleTopicClick = (topic: string) => {
    toast({
      title: "Topic Selected!",
      description: `Let's explore ${topic.replace(/_/g, " ")}! What would you like to know?`,
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 220; // Block width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const topics = generateTopicBlocks(currentTopic);

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <ScrollArea className="w-full">
        <div
          ref={scrollRef}
          className="flex gap-4 pb-4 snap-x snap-mandatory"
        >
          {topics.map((topic, index) => (
            <TopicBlock key={index} {...topic} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};