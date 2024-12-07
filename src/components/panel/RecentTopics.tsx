import React from "react";
import { History } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Recent Topics</h3>
      </div>
      <div className="space-y-2">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <motion.button
              key={topic.topic}
              className="w-full text-left p-2 rounded-lg hover:bg-white/50 
                transition-colors duration-200 flex items-center gap-2"
              whileHover={{ x: 4 }}
            >
              <span className="text-xl">{topic.emoji}</span>
              <span className="text-sm font-medium">{topic.topic}</span>
            </motion.button>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            Start exploring topics to see them here!
          </p>
        )}
      </div>
    </div>
  );
};