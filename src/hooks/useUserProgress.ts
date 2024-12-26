import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProgress } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export const useUserProgress = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streak_days: 0,
    last_interaction_date: new Date().toISOString().split('T')[0],
    topicsExplored: 0,
    questionsAsked: 0,
    quizScore: 0
  });
  
  const { toast } = useToast();

  const showLevelUpToast = (newLevel: number) => {
    toast({
      title: "Level Up! 🎉",
      description: `Congratulations! You've reached level ${newLevel}!`,
      className: "bg-primary text-white"
    });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const showPointsToast = (points: number) => {
    toast({
      title: "Points Earned! ⭐",
      description: `You've earned ${points} points!`,
      className: "bg-secondary text-white"
    });
  };

  const showStreakToast = (days: number) => {
    toast({
      title: "Streak Updated! 🔥",
      description: `You're on a ${days} day streak!`,
      className: "bg-accent text-white"
    });
  };

  const fetchUserProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user progress:', error);
      return;
    }

    if (data) {
      // Map snake_case database fields to camelCase TypeScript fields
      setUserProgress({
        points: data.points,
        level: data.level,
        streak_days: data.streak_days,
        last_interaction_date: data.last_interaction_date,
        topicsExplored: data.topics_explored,
        questionsAsked: data.questions_asked,
        quizScore: data.quiz_score
      });
    }
  };

  const updateUserProgress = async (points: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newPoints = userProgress.points + points;
      const currentLevel = userProgress.level;
      const pointsForNextLevel = currentLevel * 100;

      let newLevel = currentLevel;
      if (newPoints >= pointsForNextLevel) {
        newLevel = currentLevel + 1;
        showLevelUpToast(newLevel);
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update({
          points: newPoints,
          level: newLevel,
          last_interaction_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserProgress(prev => ({
          ...prev,
          points: newPoints,
          level: newLevel,
          last_interaction_date: data.last_interaction_date,
          streak_days: data.streak_days
        }));

        showPointsToast(points);

        if (data.streak_days > userProgress.streak_days) {
          showStreakToast(data.streak_days);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUserProgress();
  }, []);

  return {
    userProgress,
    updateUserProgress
  };
};