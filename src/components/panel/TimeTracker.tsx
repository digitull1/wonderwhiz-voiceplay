import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { TimeTrackerRing } from "./TimeTrackerRing";
import { supabase } from "@/integrations/supabase/client";

interface TimeSpent {
  today: number;
  week: number;
}

export const TimeTracker = () => {
  const [timeSpent, setTimeSpent] = useState<TimeSpent>({ today: 0, week: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSpent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        // Fetch today's time
        const { data: todayData } = await supabase
          .from('learning_time')
          .select('minutes_spent')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        // Fetch week's time
        const { data: weekData } = await supabase
          .from('learning_time')
          .select('minutes_spent')
          .eq('user_id', user.id)
          .gte('date', weekAgo.toISOString().split('T')[0]);

        const todayMinutes = todayData?.minutes_spent || 0;
        const weekMinutes = weekData?.reduce((acc, curr) => acc + (curr.minutes_spent || 0), 0) || 0;

        setTimeSpent({
          today: todayMinutes,
          week: weekMinutes
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching time spent:', error);
        setIsLoading(false);
      }
    };

    fetchTimeSpent();

    // Set up real-time subscription
    const timeChannel = supabase
      .channel('learning_time_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learning_time'
        },
        () => {
          console.log('Learning time updated, refetching...');
          fetchTimeSpent();
        }
      )
      .subscribe();

    // Update every minute
    const interval = setInterval(fetchTimeSpent, 60000);

    return () => {
      clearInterval(interval);
      timeChannel.unsubscribe();
    };
  }, []);

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Learning Time</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <motion.div
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <TimeTrackerRing
            percentage={(timeSpent.today / 60) * 100}
            size={120}
            strokeWidth={8}
            color="stroke-primary"
            label="Today"
            time={`${timeSpent.today}m`}
            goal={60}
          />
          <TimeTrackerRing
            percentage={(timeSpent.week / 300) * 100}
            size={120}
            strokeWidth={8}
            color="stroke-secondary"
            label="This Week"
            time={`${timeSpent.week}m`}
            goal={300}
          />
        </div>
      )}
    </motion.div>
  );
};