import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { TimeTracker } from "./panel/TimeTracker";
import { RecentTopics } from "./panel/RecentTopics";
import { ProgressCard } from "./panel/ProgressCard";
import { TalkToWizzy } from "./panel/TalkToWizzy";

interface CollapsiblePanelProps {
  userProgress: {
    points: number;
    level: number;
    streak_days: number;
  };
  role?: string;
  "aria-label"?: string;
}

interface ExploredTopic {
  topic: string;
  emoji: string;
  last_explored_at: string;
}

export const CollapsiblePanel = ({ 
  userProgress, 
  role,
  "aria-label": ariaLabel 
}: CollapsiblePanelProps) => {
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
      <SheetContent 
        className="w-[90vw] sm:w-[400px] bg-gradient-to-br from-purple-50 to-blue-50"
        role={role}
        aria-label={ariaLabel}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            Your Progress
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProgressCard userProgress={userProgress} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TimeTracker timeSpent={timeSpent} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RecentTopics topics={recentTopics} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TalkToWizzy />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};