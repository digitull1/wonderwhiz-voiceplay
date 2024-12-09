import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { TimeTrackerRing } from "./TimeTrackerRing";

export const TimeTracker = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dailyGoal = 30; // 30 minutes daily goal

  useEffect(() => {
    const fetchTimeSpent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('learning_time')
          .select('minutes_spent')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (error) throw error;
        
        setTimeSpent(data?.minutes_spent || 0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching time spent:', error);
        setIsLoading(false);
      }
    };

    fetchTimeSpent();
    const interval = setInterval(fetchTimeSpent, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.min((timeSpent / dailyGoal) * 100, 100);

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold">Today's Progress</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <motion.div
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <TimeTrackerRing
            percentage={percentage}
            time={`${timeSpent}m`}
            label="Time Spent"
            goal={dailyGoal}
            color="stroke-secondary"
          />
        </div>
      )}
    </motion.div>
  );
};