import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TopicSelection } from "../TopicSelection";

interface InterestsStepProps {
  selectedTopics: string[];
  onTopicToggle: (topicId: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const InterestsStep: React.FC<InterestsStepProps> = ({
  selectedTopics,
  onTopicToggle,
  onNext,
  onBack,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">What interests you? 🤔</h2>
      <p className="text-gray-600 text-center">
        Choose topics you'd like to explore and learn about!
      </p>
      
      <TopicSelection
        selectedTopics={selectedTopics}
        onTopicToggle={onTopicToggle}
        disabled={isLoading}
      />

      <div className="flex gap-4 mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
          disabled={isLoading || selectedTopics.length === 0}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};