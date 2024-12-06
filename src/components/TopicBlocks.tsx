import React, { useEffect, useState } from "react";
import { TopicBlock } from "./TopicBlock";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
}

interface TopicBlocksProps {
  currentTopic: string;
  onTopicSelect: (topic: string) => void;
  lastMessage?: string;
}

export const TopicBlocks: React.FC<TopicBlocksProps> = ({ 
  currentTopic, 
  onTopicSelect,
  lastMessage 
}) => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [depth, setDepth] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const fetchDynamicBlocks = async (query: string, topicContext: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blocks', {
        body: {
          query,
          context: topicContext,
          age_group: "8-12",
          depth
        }
      });

      if (error) throw error;

      const parsedData = typeof data.choices[0].message.content === 'string' 
        ? JSON.parse(data.choices[0].message.content) 
        : data.choices[0].message.content;

      setBlocks(parsedData.blocks.map((block: any) => ({
        ...block,
        description: "Click to explore more!",
        color: getRandomGradient()
      })));
    } catch (error) {
      console.error('Error fetching blocks:', error);
      toast({
        title: "Oops!",
        description: "Had trouble generating new topics. Try again!",
        variant: "destructive"
      });
      setBlocks(generateFallbackBlocks(currentTopic));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lastMessage) {
      fetchDynamicBlocks(lastMessage, currentTopic);
    } else {
      setBlocks(generateFallbackBlocks(currentTopic));
    }
  }, [lastMessage, currentTopic]);

  const handleTopicClick = async (block: Block) => {
    onTopicSelect(block.metadata.topic);
    setDepth(prev => prev + 1);
    await fetchDynamicBlocks(block.title, block.metadata.topic);
    
    toast({
      title: "New Adventure!",
      description: `Let's explore ${block.title}!`,
      className: "bg-primary text-white",
    });
  };

  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-purple-600 to-blue-700",
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-indigo-600 to-purple-700",
      "bg-gradient-to-br from-green-500 to-emerald-700",
      "bg-gradient-to-br from-orange-500 to-red-700"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const generateFallbackBlocks = (topic: string) => {
    const baseBlocks = {
      space: [
        {
          title: "What's Inside a Black Hole? 🕳️",
          description: "Journey into the cosmic abyss",
          metadata: { topic: "black_hole_interior" },
          color: "bg-gradient-to-br from-purple-600 to-blue-700"
        },
        {
          title: "Are We Alone in Space? 👽",
          description: "The search for alien life",
          metadata: { topic: "alien_life" },
          color: "bg-gradient-to-br from-blue-500 to-purple-600"
        },
        {
          title: "How Do Stars Die? ⭐",
          description: "The explosive end of stellar life",
          metadata: { topic: "stellar_death" },
          color: "bg-gradient-to-br from-indigo-600 to-purple-700"
        }
      ],
      biology: [
        {
          title: "Inside Your DNA! 🧬",
          description: "Your body's instruction manual",
          metadata: { topic: "dna_secrets" },
          color: "bg-gradient-to-br from-green-500 to-emerald-700"
        },
        {
          title: "Why Do We Dream? 💭",
          description: "The mystery of sleep",
          metadata: { topic: "dream_science" },
          color: "bg-gradient-to-br from-emerald-500 to-green-700"
        },
        {
          title: "Your Amazing Brain! 🧠",
          description: "How thoughts happen",
          metadata: { topic: "brain_function" },
          color: "bg-gradient-to-br from-teal-500 to-green-700"
        }
      ],
      earth: [
        {
          title: "Volcano Secrets! 🌋",
          description: "Earth's fiery mountains",
          metadata: { topic: "volcano_secrets" },
          color: "bg-gradient-to-br from-orange-500 to-red-700"
        },
        {
          title: "Ocean Mysteries! 🌊",
          description: "Deep sea adventures",
          metadata: { topic: "ocean_exploration" },
          color: "bg-gradient-to-br from-blue-500 to-cyan-700"
        },
        {
          title: "Dinosaur Time! 🦕",
          description: "Ancient earth mysteries",
          metadata: { topic: "dinosaur_era" },
          color: "bg-gradient-to-br from-amber-500 to-orange-700"
        }
      ]
    };

    return baseBlocks[topic as keyof typeof baseBlocks] || baseBlocks.space;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.blocks-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="relative w-full">
      <Button 
        variant="ghost" 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90"
        onClick={() => handleScroll('left')}
        disabled={scrollPosition <= 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <ScrollArea className="w-full py-4 overflow-x-auto blocks-container">
        <motion.div 
          className="flex gap-4 pb-4 px-2 snap-x snap-mandatory"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blocks.map((block, index) => (
            <motion.div
              key={`${block.title}-${index}`}
              className="snap-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TopicBlock
                title={block.title}
                description={block.description}
                color={block.color}
                onClick={() => handleTopicClick(block)}
              />
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>

      <Button 
        variant="ghost" 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90"
        onClick={() => handleScroll('right')}
        disabled={scrollPosition >= (blocks.length * 300) - 300}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
