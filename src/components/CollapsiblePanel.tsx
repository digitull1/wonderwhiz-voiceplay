import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProgressCard } from "./panel/ProgressCard";
import { TopicHistory } from "./panel/TopicHistory";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { UserProgress } from "@/types/chat";

interface CollapsiblePanelProps {
  userProgress: UserProgress;
}

export const CollapsiblePanel = ({ userProgress }: CollapsiblePanelProps) => {
  const handleTopicClick = (topic: string) => {
    console.log('Topic clicked:', topic);
    // Add your topic click handling logic here
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <Dialog>
        <DialogContent>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your Learning Journey
          </DialogTitle>
          <div className="space-y-6">
            <ProgressCard userProgress={userProgress} />
            <TopicHistory topics={[]} onTopicClick={handleTopicClick} />
            <TalkToWizzy />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};