import { useState } from "react";
import { Block } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBlockInteractions = (
  updateUserProgress: (points: number) => Promise<void>,
  updateBlocksExplored: (topic: string) => void,
  sendMessage: (message: string, skipUserMessage?: boolean) => Promise<void>
) => {
  const { toast } = useToast();
  const [currentTopic, setCurrentTopic] = useState("space");

  const trackLearningTime = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingTime, error: fetchError } = await supabase
      .from('learning_time')
      .select('*')
      .eq('date', today)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching learning time:', fetchError);
      return;
    }

    if (existingTime) {
      const { error: updateError } = await supabase
        .from('learning_time')
        .update({ 
          minutes_spent: (existingTime.minutes_spent || 0) + 1 
        })
        .eq('id', existingTime.id);

      if (updateError) {
        console.error('Error updating learning time:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('learning_time')
        .insert([{ 
          minutes_spent: 1,
          date: today,
          user_id: userId
        }]);

      if (insertError) {
        console.error('Error inserting learning time:', insertError);
      }
    }
  };

  const trackExploredTopic = async (userId: string, topic: string) => {
    const { error } = await supabase
      .from('explored_topics')
      .upsert({
        user_id: userId,
        topic: topic,
        emoji: '🌟',
        last_explored_at: new Date().toISOString(),
        time_spent: 1
      }, {
        onConflict: 'user_id,topic'
      });

    if (error) {
      console.error('Error tracking explored topic:', error);
    }
  };

  const handleBlockClick = async (block: Block) => {
    const topic = block?.metadata?.topic || currentTopic;
    console.log('Block clicked:', block);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      setCurrentTopic(topic);
      updateBlocksExplored(topic);
      
      await Promise.all([
        trackLearningTime(user.id),
        trackExploredTopic(user.id, topic),
        updateUserProgress(10)
      ]);
      
      toast({
        title: "Great exploring! 🚀",
        description: "You've earned points for your curiosity!",
        className: "bg-secondary text-white",
      });
      
      await sendMessage(`Tell me about "${block?.title || 'this topic'}"`, true);
    } catch (error) {
      console.error('Error in handleBlockClick:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again!",
        variant: "destructive"
      });
    }
  };

  return {
    currentTopic,
    handleBlockClick
  };
};