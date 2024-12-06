import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProgress } from "@/types/chat";

export const useUserProgress = () => {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streak_days: 0,
    last_interaction_date: new Date().toISOString()
  });

  const updateUserProgress = async (points: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          points: points,
          last_interaction_date: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserProgress(data);
        toast({
          title: "Points earned! 🎉",
          description: `You've earned ${points} points!`,
          className: "bg-primary text-white",
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return { userProgress, updateUserProgress };
};