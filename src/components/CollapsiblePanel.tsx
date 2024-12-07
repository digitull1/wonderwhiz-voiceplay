import React from "react";
import { motion } from "framer-motion";
import { TimeTracker } from "./panel/TimeTracker";
import { RecentTopics } from "./panel/RecentTopics";
import { ProgressCard } from "./panel/ProgressCard";
import { TalkToWizzy } from "./panel/TalkToWizzy";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface CollapsiblePanelProps {
  userProgress: {
    points: number;
    level: number;
    streak_days: number;
  };
}

export const CollapsiblePanel = ({ userProgress }: CollapsiblePanelProps) => {
  return (
    <div className="h-full flex flex-col gap-6 pt-6">
      <SheetHeader>
        <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Progress
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProgressCard userProgress={userProgress} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TimeTracker timeSpent={{ today: 30, week: 120 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RecentTopics topics={[]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TalkToWizzy />
        </motion.div>
      </div>
    </div>
  );
};