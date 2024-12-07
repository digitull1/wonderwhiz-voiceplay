import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProgress } from "@/types/chat";

export const useUserProgress = (tempUserId?: string | null) => {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streak_days: 0,
    last_interaction_date: new Date().toISOString()
  });

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user && !tempUserId) {
          console.log('No user found for progress tracking');
          return;
        }

        if (tempUserId) {
          // Use local storage for temporary progress tracking
          const storedProgress = localStorage.getItem(`progress_${tempUserId}`);
          if (storedProgress) {
            setUserProgress(JSON.parse(storedProgress));
          }
          return;
        }

        // Initial fetch from Supabase
        const { data: initialProgress, error: fetchError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching initial progress:', fetchError);
          return;
        }

        if (initialProgress) {
          console.log('Initial progress loaded:', initialProgress);
          setUserProgress(initialProgress);
        }

        // Subscribe to changes
        const channel = supabase
          .channel(`user_progress_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_progress',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Progress update received:', payload);
              if (payload.new) {
                setUserProgress(payload.new as UserProgress);
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });

        return () => {
          console.log('Cleaning up subscription');
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error in setupSubscription:', error);
        toast({
          title: "Error",
          description: "Failed to track progress updates",
          variant: "destructive"
        });
      }
    };

    setupSubscription();
  }, [toast, tempUserId]);

  const updateUserProgress = async (pointsToAdd: number): Promise<void> => {
    try {
      console.log('Updating user progress with points:', pointsToAdd);
      
      if (tempUserId) {
        // Update progress in local storage for temporary users
        const newPoints = userProgress.points + pointsToAdd;
        const newProgress = {
          ...userProgress,
          points: newPoints,
          last_interaction_date: new Date().toISOString()
        };
        localStorage.setItem(`progress_${tempUserId}`, JSON.stringify(newProgress));
        setUserProgress(newProgress);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      // Update progress in Supabase for authenticated users
      const { data: currentProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current progress:', fetchError);
        throw fetchError;
      }

      const newPoints = (currentProgress?.points || 0) + pointsToAdd;
      console.log('Calculating new points:', currentProgress?.points, '+', pointsToAdd, '=', newPoints);
      
      const { data: pointsData } = await supabase
        .rpc('calculate_next_level_points', {
          current_level: currentProgress?.level || 1
        }) as { data: number | null };

      const pointsNeeded = pointsData ?? 100;
      console.log('Points needed for next level:', pointsNeeded);

      const shouldLevelUp = newPoints >= pointsNeeded;
      const newLevel = shouldLevelUp ? (currentProgress?.level || 1) + 1 : (currentProgress?.level || 1);

      const { data, error: updateError } = await supabase
        .from('user_progress')
        .upsert({ 
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          last_interaction_date: new Date().toISOString()
        })
        .select()
        .single();

      if (updateError) {
        console.error('Error updating progress:', updateError);
        throw updateError;
      }

      console.log('Progress updated successfully:', data);

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
            description: `+${pointsToAdd} points! ${remainingPoints} more to level ${currentProgress?.level + 1}!`,
            className: "bg-gradient-to-r from-secondary to-green-500 text-white",
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