import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { TimeTrackerRing } from "./TimeTrackerRing";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface TimeTrackerProps {
  timeSpent: {
    today: number;
    week: number;
  };
}

export const TimeTracker = ({ timeSpent: initialTimeSpent }: TimeTrackerProps) => {
  const [timeSpent, setTimeSpent] = useState(initialTimeSpent);
  
  useEffect(() => {
    const fetchLearningTime = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Get date 7 days ago
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];

        console.log('Fetching learning time for user:', user.id);
        console.log('Date range:', weekAgoStr, 'to', today);

        // Fetch today's learning time
        const { data: todayData, error: todayError } = await supabase
          .from('learning_time')
          .select('minutes_spent')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (todayError) {
          console.error('Error fetching today\'s learning time:', todayError);
          if (todayError.code !== 'PGRST116') throw todayError;
        }

        // Fetch week's learning time
        const { data: weekData, error: weekError } = await supabase
          .from('learning_time')
          .select('minutes_spent')
          .eq('user_id', user.id)
          .gte('date', weekAgoStr)
          .lte('date', today);

        if (weekError) {
          console.error('Error fetching week\'s learning time:', weekError);
          throw weekError;
        }

        console.log('Today\'s data:', todayData);
        console.log('Week\'s data:', weekData);

        // Calculate total minutes for the week
        const weeklyMinutes = weekData?.reduce((acc, curr) => acc + (curr.minutes_spent || 0), 0) || 0;

        setTimeSpent({
          today: todayData?.minutes_spent || 0,
          week: weeklyMinutes
        });

      } catch (error) {
        console.error('Error in fetchLearningTime:', error);
      }
    };

    fetchLearningTime();
    // Set up an interval to refresh data every minute
    const interval = setInterval(fetchLearningTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate percentages based on daily and weekly goals
  const dailyGoal = 60; // 60 minutes per day goal
  const weeklyGoal = 300; // 300 minutes per week goal (5 hours)
  
  const todayPercentage = Math.min((timeSpent.today / dailyGoal) * 100, 100);
  const weekPercentage = Math.min((timeSpent.week / weeklyGoal) * 100, 100);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold">Learning Time</h3>
      </div>
      
      <div className="flex justify-around items-center gap-4">
        <TimeTrackerRing
          percentage={todayPercentage}
          color="stroke-secondary"
          label="Today"
          time={formatTime(timeSpent.today)}
          size={100}
          goal={dailyGoal}
        />
        <TimeTrackerRing
          percentage={weekPercentage}
          color="stroke-primary"
          label="This Week"
          time={formatTime(timeSpent.week)}
          size={100}
          goal={weeklyGoal}
        />
      </div>
      
      <motion.div 
        className="mt-3 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {timeSpent.today === 0 && timeSpent.week === 0 ? (
          "Start your learning journey today! 🌟"
        ) : (
          `${formatTime(timeSpent.today)} today - Keep going! ✨`
        )}
      </motion.div>
    </motion.div>
  );
};