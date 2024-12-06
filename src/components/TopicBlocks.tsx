import React from "react";
import { TopicBlock } from "./TopicBlock";
import { Rocket, Microscope, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

export const TopicBlocks = () => {
  const { toast } = useToast();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const topics = [
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Discover Black Holes! 🌌",
      description: "Journey into the most mysterious objects in space",
      color: "bg-primary text-white",
      onClick: () => handleTopicClick("space"),
    },
    {
      icon: <Microscope className="w-6 h-6 text-white" />,
      title: "Amazing DNA Facts! 🧬",
      description: "Unlock the secrets of life itself",
      color: "bg-accent text-white",
      onClick: () => handleTopicClick("science"),
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Explore Volcanoes! 🌋",
      description: "Discover Earth's most powerful forces",
      color: "bg-secondary text-white",
      onClick: () => handleTopicClick("nature"),
    },
  ];

  const handleTopicClick = (topic: string) => {
    toast({
      title: "Topic Selected!",
      description: `Let's explore ${topic}! What would you like to know?`,
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