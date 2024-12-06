import { useState, useEffect } from "react";
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

  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Initial fetch
      const { data: initialProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (initialProgress) {
        setUserProgress(initialProgress);
      }

      // Subscribe to changes
      const subscription = supabase
        .channel('user_progress_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Progress updated:', payload.new);
            setUserProgress(payload.new as UserProgress);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupSubscription();
  }, []);

  const updateUserProgress = async (pointsToAdd: number): Promise<void> => {
    try {
      console.log('Updating user progress with points:', pointsToAdd);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      // First, get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentProgress) {
        console.log('No current progress found');
        return;
      }

      const newPoints = currentProgress.points + pointsToAdd;
      
      // Calculate points needed for next level
      const { data: pointsData } = await supabase
        .rpc('calculate_next_level_points', {
          current_level: currentProgress.level
        }) as { data: number | null };

      const pointsNeeded = pointsData ?? 100; // Fallback to 100 if null
      console.log('Points needed for next level:', pointsNeeded);

      // Check if user should level up
      const shouldLevelUp = newPoints >= pointsNeeded;
      const newLevel = shouldLevelUp ? currentProgress.level + 1 : currentProgress.level;

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

      if (error) {
        console.error('Error updating progress:', error);
        throw error;
      }

      if (data) {
        setUserProgress(data);
        
        if (shouldLevelUp) {
          toast({
            title: "🎉 LEVEL UP! 🎉",
            description: `Amazing! You've reached level ${newLevel}! Keep exploring to earn more points!`,
            className: "bg-gradient-to-r from-primary to-purple-600 text-white",
          });
        } else {
          const remainingPoints = pointsNeeded - newPoints;
          toast({
            title: "⭐ Points earned!",
            description: `+${pointsToAdd} points! ${remainingPoints} more to level ${currentProgress.level + 1}!`,
            className: "bg-gradient-to-r from-secondary to-green-500 text-white",
          });
        }

        // Check and celebrate streak milestones
        if (data.streak_days > currentProgress.streak_days) {
          toast({
            title: "🔥 Streak Extended!",
            description: `${data.streak_days} days learning streak! Keep it up!`,
            className: "bg-gradient-to-r from-orange-400 to-red-500 text-white",
          });
        }
      }
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