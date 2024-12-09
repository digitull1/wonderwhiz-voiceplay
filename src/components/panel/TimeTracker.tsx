import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { TimeTrackerRing } from "./TimeTrackerRing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const TimeTracker = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTimeSpent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // First try to get existing record
      const { data: existingData, error: fetchError } = await supabase
        .from('learning_time')
        .select('minutes_spent')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching time spent:', fetchError);
        setIsLoading(false);
        return;
      }

      // If no record exists, create one
      if (!existingData) {
        const { data: newData, error: insertError } = await supabase
          .from('learning_time')
          .insert([
            {
              user_id: user.id,
              date: today,
              minutes_spent: 0
            }
          ])
          .select('minutes_spent')
          .single();

        if (insertError) {
          console.error('Error creating learning time:', insertError);
          toast({
            title: "Error",
            description: "Could not track learning time",
            variant: "destructive"
          });
        } else {
          setTimeSpent(newData?.minutes_spent || 0);
        }
      } else {
        setTimeSpent(existingData.minutes_spent || 0);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchTimeSpent:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Could not fetch learning time",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTimeSpent();
    const interval = setInterval(fetchTimeSpent, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Today's Progress</h3>
      </div>
      <div className="flex justify-center">
        <TimeTrackerRing 
          timeSpent={timeSpent} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};