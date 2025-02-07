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
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingTime, error: fetchError } = await supabase
        .from('learning_time')
        .select('*')
        .eq('date', today)
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching learning time:', fetchError);
        return;
      }

      if (existingTime) {
        console.log('Updating existing learning time:', existingTime);
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
        console.log('Creating new learning time entry');
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
    } catch (error) {
      console.error('Error tracking learning time:', error);
    }
  };

  const trackExploredTopic = async (userId: string, topic: string) => {
    try {
      console.log('Tracking explored topic:', { userId, topic });
      const { error } = await supabase
        .from('explored_topics')
        .upsert(
          {
            user_id: userId,
            topic: topic,
            emoji: '🌟',
            last_explored_at: new Date().toISOString(),
            time_spent: 1
          },
          { 
            onConflict: 'user_id,topic',
            ignoreDuplicates: false 
          }
        );

      if (error) {
        console.error('Error tracking explored topic:', error);
      }
    } catch (error) {
      console.error('Error tracking explored topic:', error);
    }
  };

  const handleBlockClick = async (block: Block) => {
    const topic = block?.metadata?.topic || currentTopic;
    console.log('Block clicked:', block);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      setCurrentTopic(topic);
      updateBlocksExplored(topic);
      
      if (user) {
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
      } else {
        console.log('No authenticated user for block interaction');
      }
      
      await sendMessage(`Tell me about "${block?.title || 'this topic'}"`, true);
      
    } catch (error) {
      console.error('Error in handleBlockClick:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong while tracking your progress. But don't worry, let's keep exploring!",
        variant: "destructive",
      });
      
      // Still allow content generation even if tracking fails
      await sendMessage(`Tell me about "${block?.title || 'this topic'}"`, true);
    }
  };

  return {
    currentTopic,
    handleBlockClick
  };
};