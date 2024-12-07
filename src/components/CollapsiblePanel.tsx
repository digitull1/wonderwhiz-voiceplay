import React from "react";
import { ProgressCard } from "./panel/ProgressCard";
import { TopicHistory } from "./panel/TopicHistory";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { UserProgress } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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

      const transformedData = data?.map(item => ({
        ...item,
        topic: `Explored ${item.topic.charAt(0).toLowerCase() + item.topic.slice(1)}`,
      })) || [];

      setTopics(transformedData);
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topic: string) => {
    const originalTopic = topic.replace('Explored ', '');
    console.log('Topic clicked:', originalTopic);
  };

  return (
    <div className="absolute right-4 top-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="bg-gradient-to-r from-primary via-secondary to-accent p-2 rounded-full 
              shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent 
          side="right"
          className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-sm border-l 
            border-gray-100 shadow-xl overflow-y-auto"
        >
          <div className="flex flex-col gap-6 p-4">
            <ProgressCard userProgress={userProgress} />
            <TopicHistory topics={topics} onTopicClick={handleTopicClick} />
            <TalkToWizzy />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};