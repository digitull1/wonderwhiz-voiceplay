import { Block } from "@/types/chat";

export const generateInitialBlocks = (age: number): Block[] => {
  const blocks = [
    {
      title: "🌟 Did You Know: Your Brain is Like a Superhero!",
      description: "Discover how your amazing brain processes over 70,000 thoughts every day! Want to learn its superpowers?",
      metadata: { topic: "brain science" },
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "🦕 Secret Ancient Giants: Dinosaur Mystery!",
      description: "Some dinosaurs were as tall as a 4-story building! Ready to uncover more incredible dino facts?",
      metadata: { topic: "dinosaurs" },
      color: "bg-gradient-to-br from-green-500 to-teal-500"
    },
    {
      title: "🚀 Space Adventure: Hidden Planets!",
      description: "There's a planet where it rains diamonds! Want to explore more cosmic wonders?",
      metadata: { topic: "space" },
      color: "bg-gradient-to-br from-blue-500 to-indigo-500"
    },
    {
      title: "🌋 Earth's Super Powers Revealed!",
      description: "Our planet has underwater volcanoes taller than Mount Everest! Ready to dive into Earth's secrets?",
      metadata: { topic: "earth science" },
      color: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      title: "🧪 Magic of Science: Mind-Blowing Experiments!",
      description: "You can make invisible ink with lemon juice! Want to become a science wizard?",
      metadata: { topic: "experiments" },
      color: "bg-gradient-to-br from-yellow-500 to-orange-500"
    }
  ];

  return blocks;
};