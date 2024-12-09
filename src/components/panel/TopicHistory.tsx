import React, { useEffect, useState } from "react";
import { History, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Topic {
  topic: string;
  emoji: string;
  last_explored_at: string;
}

interface TopicHistoryProps {
  onTopicClick: (topic: string) => void;
}

export const TopicHistory = ({ onTopicClick }: TopicHistoryProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('explored_topics')
          .select('topic, emoji, last_explored_at')
          .eq('user_id', user.id)
          .order('last_explored_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching topics:', error);
          toast({
            title: "Error",
            description: "Could not fetch recent adventures",
            variant: "destructive"
          });
          return;
        }

        setTopics(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchTopics:', error);
        setIsLoading(false);
      }
    };

    fetchTopics();

    // Set up real-time subscription
    const topicsChannel = supabase
      .channel('explored_topics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'explored_topics'
        },
        () => {
          console.log('Topics updated, refetching...');
          fetchTopics();
        }
      )
      .subscribe();

    return () => {
      topicsChannel.unsubscribe();
    };
  }, [toast]);

  const formatTopicLabel = (topic: string) => {
    return topic
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Recent Adventures</h3>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <motion.div 
            className="flex justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : topics.length > 0 ? (
          topics.map((topic, index) => (
            <TooltipProvider key={topic.topic + index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="w-full text-left p-3 rounded-lg bg-white/50 hover:bg-white/80 
                      transition-all duration-200 flex items-center gap-3
                      group focus:outline-none focus:ring-2 focus:ring-primary/50
                      shadow-sm hover:shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onTopicClick(topic.topic)}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-xl" role="img" aria-label={topic.topic}>
                      {topic.emoji}
                    </span>
                    <span className="text-sm font-medium flex-1 text-gray-700">
                      {formatTopicLabel(topic.topic)}
                    </span>
                    <ChevronRight 
                      className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200"
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continue exploring {formatTopicLabel(topic.topic)}!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <motion.p 
            className="text-sm text-gray-500 text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Start exploring topics to see them here! ✨
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};