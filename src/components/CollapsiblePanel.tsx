import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProgressCard } from "./panel/ProgressCard";
import { TopicHistory } from "./panel/TopicHistory";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { UserProgress } from "@/types/chat";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";

interface CollapsiblePanelProps {
  userProgress: UserProgress;
}

export const CollapsiblePanel = ({ userProgress }: CollapsiblePanelProps) => {
  const [topics, setTopics] = React.useState([]);

  React.useEffect(() => {
    const fetchTopics = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('explored_topics')
        .select('topic, emoji, last_explored_at')
        .eq('user_id', user.id)
        .order('last_explored_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching topics:', error);
        return;
      }

      setTopics(data || []);
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topic: string) => {
    console.log('Topic clicked:', topic);
    // Add your topic click handling logic here
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Learning Journey
        </h2>
        <ProgressCard userProgress={userProgress} />
        <TopicHistory topics={topics} onTopicClick={handleTopicClick} />
        <TalkToWizzy />
      </div>
    </div>
  );
};