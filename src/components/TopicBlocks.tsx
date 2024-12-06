import React from "react";
import { TopicBlock } from "./TopicBlock";
import { Rocket, Microscope, Globe } from "lucide-react";

export const TopicBlocks = () => {
  const topics = [
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Space 🚀",
      description: "Explore planets, stars, and galaxies!",
      color: "bg-primary text-white",
      onClick: () => console.log("Space clicked"),
    },
    {
      icon: <Microscope className="w-6 h-6 text-white" />,
      title: "Science 🔬",
      description: "Discover amazing experiments!",
      color: "bg-accent text-white",
      onClick: () => console.log("Science clicked"),
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Nature 🌍",
      description: "Learn about our amazing planet!",
      color: "bg-secondary text-white",
      onClick: () => console.log("Nature clicked"),
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {topics.map((topic, index) => (
        <div key={index} className="snap-center">
          <TopicBlock {...topic} />
        </div>
      ))}
    </div>
  );
};