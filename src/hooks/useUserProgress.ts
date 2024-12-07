import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProgress } from "@/types/chat";
import { mapDatabaseToUserProgress, getInitialUserProgress } from "@/utils/progressUtils";
import { createLevelUpToast, createPointsEarnedToast, createErrorToast } from "@/utils/progressToasts";

export const useUserProgress = (tempUserId?: string | null) => {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<UserProgress>(getInitialUserProgress());

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user && !tempUserId) {
          console.log('No user found for progress tracking');
          return;
        }

        if (tempUserId) {
          const storedProgress = localStorage.getItem(`progress_${tempUserId}`);
          if (storedProgress) {
            setUserProgress(JSON.parse(storedProgress));
          }
          return;
        }

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
          setUserProgress(mapDatabaseToUserProgress(initialProgress));
        }

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
                setUserProgress(mapDatabaseToUserProgress(payload.new));
              }
            }
          )
          .subscribe();

        return () => {
          console.log('Cleaning up subscription');
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error in setupSubscription:', error);
        toast(createErrorToast());
      }
    };

    setupSubscription();
  }, [toast, tempUserId]);

  const updateUserProgress = async (pointsToAdd: number): Promise<void> => {
    try {
      console.log('Updating user progress with points:', pointsToAdd);
      
      if (tempUserId) {
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
        });

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
          last_interaction_date: new Date().toISOString(),
          topics_explored: currentProgress?.topics_explored || 0,
          questions_asked: currentProgress?.questions_asked || 0,
          quiz_score: currentProgress?.quiz_score || 0
        })
        .select()
        .single();

      if (updateError) {
        console.error('Error updating progress:', updateError);
        throw updateError;
      }

      if (data) {
        setUserProgress(mapDatabaseToUserProgress(data));
        
        if (shouldLevelUp) {
          toast(createLevelUpToast(newLevel));
        } else {
          const remainingPoints = pointsNeeded - newPoints;
          toast(createPointsEarnedToast(pointsToAdd, remainingPoints, currentProgress?.level + 1));
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast(createErrorToast());
    }
  };

  return { userProgress, updateUserProgress };
};