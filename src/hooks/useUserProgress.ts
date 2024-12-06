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

  const updateUserProgress = async (pointsToAdd: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentProgress) return;

      const newPoints = currentProgress.points + pointsToAdd;
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          points: newPoints,
          level: newLevel,
          last_interaction_date: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserProgress(data);
        
        // Show different toasts based on point changes
        if (currentProgress.level < newLevel) {
          toast({
            title: "🎉 LEVEL UP! 🎉",
            description: `Incredible! You've reached level ${newLevel}!`,
            className: "bg-gradient-to-r from-primary to-purple-600 text-white",
          });
        } else {
          toast({
            title: "Points earned! ⭐",
            description: `You've earned ${pointsToAdd} points!`,
            className: "bg-gradient-to-r from-secondary to-green-500 text-white",
          });
        }
      }

      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Oops!",
        description: "Couldn't update your progress. Don't worry, keep exploring!",
        variant: "destructive"
      });
    }
  };

  return { userProgress, updateUserProgress };
};