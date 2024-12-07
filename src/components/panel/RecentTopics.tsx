import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExploredTopic {
  topic: string;
  emoji: string;
  last_explored_at: string;
}

interface RecentTopicsProps {
  onTopicClick?: (topic: string) => void;
}

export const RecentTopics = ({ onTopicClick }: RecentTopicsProps) => {
  const [recentTopics, setRecentTopics] = useState<ExploredTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          return;
        }

        console.log('Fetched topics:', data);
        setRecentTopics(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchTopics:', error);
        setIsLoading(false);
      }
    };

    fetchTopics();
    // Refresh topics every 30 seconds
    const interval = setInterval(fetchTopics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTopicClick = (topic: string) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Recent Topics</h3>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-4">
            <motion.div
              className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : recentTopics.length > 0 ? (
          recentTopics.map((topic, index) => (
            <TooltipProvider key={topic.topic + index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="w-full text-left p-3 rounded-lg hover:bg-white/50 
                      transition-colors duration-200 flex items-center gap-2
                      group focus:outline-none focus:ring-2 focus:ring-primary/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    onClick={() => handleTopicClick(topic.topic)}
                  >
                    <span className="text-xl" role="img" aria-label={topic.topic}>
                      {topic.emoji}
                    </span>
                    <span className="text-sm font-medium flex-1">{topic.topic}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continue exploring {topic.topic}!</p>
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
    </div>
  );
};