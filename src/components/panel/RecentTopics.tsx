import React from "react";
import { History } from "lucide-react";
import { motion } from "framer-motion";
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
  topics: ExploredTopic[];
}

export const RecentTopics = ({ topics }: RecentTopicsProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Recent Topics</h3>
      </div>
      <div className="space-y-2">
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <TooltipProvider key={topic.topic}>
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