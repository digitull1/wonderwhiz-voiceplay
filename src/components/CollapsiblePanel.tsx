import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, History, Star, MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

interface CollapsiblePanelProps {
  userProgress: {
    points: number;
    level: number;
    streak_days: number;
  };
}

interface ExploredTopic {
  topic: string;
  emoji: string;
  last_explored_at: string;
}

interface LearningTime {
  minutes_spent: number;
  date: string;
}

export const CollapsiblePanel = ({ userProgress }: CollapsiblePanelProps) => {
  const [recentTopics, setRecentTopics] = useState<ExploredTopic[]>([]);
  const [timeSpent, setTimeSpent] = useState({
    today: 0,
    week: 0,
  });

  useEffect(() => {
    fetchRecentTopics();
    fetchLearningTime();
  }, []);

  const fetchRecentTopics = async () => {
    const { data, error } = await supabase
      .from('explored_topics')
      .select('topic, emoji, last_explored_at')
      .order('last_explored_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching topics:', error);
      return;
    }

    setRecentTopics(data || []);
  };

  const fetchLearningTime = async () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('learning_time')
      .select('minutes_spent, date')
      .gte('date', weekAgo)
      .lte('date', today);

    if (error) {
      console.error('Error fetching learning time:', error);
      return;
    }

    const todayMinutes = data?.find(d => d.date === today)?.minutes_spent || 0;
    const weekMinutes = data?.reduce((acc, curr) => acc + (curr.minutes_spent || 0), 0) || 0;

    setTimeSpent({
      today: todayMinutes,
      week: weekMinutes,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg
            hover:shadow-xl transition-all duration-300 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star className="w-6 h-6 text-primary" />
        </motion.button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[400px] bg-gradient-to-br from-purple-50 to-blue-50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            Your Progress
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Points & Level Section */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-primary">Level {userProgress.level}</h3>
                <p className="text-sm text-gray-600">⭐ {userProgress.points} Points</p>
                <p className="text-sm text-gray-600">🔥 {userProgress.streak_days} Day Streak</p>
              </div>
              <Star className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </motion.div>

          {/* Time Tracker */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Time Spent Learning</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="text-sm font-medium">{timeSpent.today} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full"
                  style={{ width: `${(timeSpent.today / 60) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="text-sm font-medium">{timeSpent.week} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full"
                  style={{ width: `${(timeSpent.week / 300) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Recent Topics */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Recent Topics</h3>
            </div>
            <div className="space-y-2">
              {recentTopics.length > 0 ? (
                recentTopics.map((topic, index) => (
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
          </motion.div>

          {/* Talk to Wizzy Widget */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Talk to Wizzy</h3>
            </div>
            <div className="w-full h-[300px] rounded-lg overflow-hidden">
              <div className="elevenlabs-widget">
                <elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>
              </div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};