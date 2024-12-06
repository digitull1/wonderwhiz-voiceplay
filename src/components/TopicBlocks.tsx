import React from "react";
import { TopicBlock } from "./TopicBlock";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

interface TopicBlocksProps {
  currentTopic: string;
  onTopicSelect: (topic: string) => void;
}

export const TopicBlocks: React.FC<TopicBlocksProps> = ({ currentTopic, onTopicSelect }) => {
  const { toast } = useToast();

  const generateDynamicBlocks = (topic: string) => {
    const baseBlocks = {
      space: [
        {
          title: "What's Inside a Black Hole? 🕳️",
          description: "Journey into the cosmic abyss",
          color: "bg-gradient-to-br from-purple-600 to-blue-700",
          topic: "black_hole_interior"
        },
        {
          title: "Are We Alone in Space? 👽",
          description: "The search for alien life",
          color: "bg-gradient-to-br from-blue-500 to-purple-600",
          topic: "alien_life"
        },
        {
          title: "How Do Stars Die? ⭐",
          description: "The explosive end of stellar life",
          color: "bg-gradient-to-br from-indigo-600 to-purple-700",
          topic: "stellar_death"
        }
      ],
      biology: [
        {
          title: "Inside Your DNA! 🧬",
          description: "Your body's instruction manual",
          color: "bg-gradient-to-br from-green-500 to-emerald-700",
          topic: "dna_secrets"
        },
        {
          title: "Why Do We Dream? 💭",
          description: "The mystery of sleep",
          color: "bg-gradient-to-br from-emerald-500 to-green-700",
          topic: "dream_science"
        },
        {
          title: "Your Amazing Brain! 🧠",
          description: "How thoughts happen",
          color: "bg-gradient-to-br from-teal-500 to-green-700",
          topic: "brain_function"
        }
      ],
      earth: [
        {
          title: "Volcano Secrets! 🌋",
          description: "Earth's fiery mountains",
          color: "bg-gradient-to-br from-orange-500 to-red-700",
          topic: "volcano_secrets"
        },
        {
          title: "Ocean Mysteries! 🌊",
          description: "Deep sea adventures",
          color: "bg-gradient-to-br from-blue-500 to-cyan-700",
          topic: "ocean_exploration"
        },
        {
          title: "Dinosaur Time! 🦕",
          description: "Ancient earth mysteries",
          color: "bg-gradient-to-br from-amber-500 to-orange-700",
          topic: "dinosaur_era"
        }
      ]
    };

    return baseBlocks[topic as keyof typeof baseBlocks] || baseBlocks.space;
  };

  const handleTopicClick = (topic: string) => {
    onTopicSelect(topic);
    toast({
      title: "New Adventure!",
      description: `Let's explore ${topic.replace(/_/g, " ")}! What would you like to know?`,
      className: "bg-primary text-white",
    });
  };

  const blocks = generateDynamicBlocks(currentTopic);

  return (
    <ScrollArea className="w-full py-4">
      <motion.div 
        className="flex gap-4 pb-4 px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {blocks.map((block, index) => (
          <motion.div
            key={block.topic}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TopicBlock
              title={block.title}
              description={block.description}
              color={block.color}
              onClick={() => handleTopicClick(block.topic)}
            />
          </motion.div>
        ))}
      </motion.div>
    </ScrollArea>
  );
};