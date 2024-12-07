import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";
import { BlockCard } from "./blocks/BlockCard";
import { BlocksNavigation } from "./blocks/BlocksNavigation";
import { supabase } from "@/integrations/supabase/client";

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const fetchDynamicBlocks = async (query: string, topicContext: string) => {
    setIsLoading(true);
    try {
      console.log('Fetching blocks for:', { query, topicContext, depth });
      const { data, error } = await supabase.functions.invoke('generate-blocks', {
        body: {
          query,
          context: topicContext,
          age_group: "8-12",
          depth
        }
      });

      if (error) throw error;

      console.log('Received blocks data:', data);
      const parsedData = typeof data.choices[0].message.content === 'string' 
        ? JSON.parse(data.choices[0].message.content) 
        : data.choices[0].message.content;

      setBlocks(parsedData.blocks.map((block: Block) => ({
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const scrollAmount = direction === 'left' ? -300 : 300;
    containerRef.current.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
    setScrollPosition(prev => prev + scrollAmount);
  };

  const handleBlockClick = async (block: Block) => {
    console.log('Block clicked:', block);
    onTopicSelect(block.metadata.topic);
    setDepth(prev => prev + 1);
    
    toast({
      title: "New Adventure!",
      description: `Let's explore ${block.title}!`,
      className: "bg-primary text-white",
    });

    await fetchDynamicBlocks(block.title, block.metadata.topic);
  };

  useEffect(() => {
    if (lastMessage) {
      console.log('Fetching blocks for last message:', lastMessage);
      fetchDynamicBlocks(lastMessage, currentTopic);
    }
  }, [lastMessage, currentTopic]);

  return (
    <div className="relative w-full">
      <BlocksNavigation 
        onScroll={handleScroll}
        canScrollLeft={scrollPosition > 0}
        canScrollRight={containerRef.current ? 
          scrollPosition < (blocks.length * 300) - containerRef.current.clientWidth : false}
      />

      <ScrollArea 
        className="w-full py-4 overflow-x-auto blocks-container" 
        ref={containerRef}
      >
        <motion.div 
          className="flex gap-4 pb-4 px-2 snap-x snap-mandatory"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blocks.map((block, index) => (
            <BlockCard
              key={`${block.title}-${index}`}
              block={block}
              index={index}
              onClick={() => handleBlockClick(block)}
              color={block.color || getRandomGradient()}
            />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
};