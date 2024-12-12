import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

interface PreferencesStepProps {
  learningStyle: string;
  onStyleChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  learningStyle,
  onStyleChange,
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
      <h2 className="text-2xl font-bold text-center">How do you learn best? 📚</h2>
      <p className="text-gray-600 text-center">
        Let us know your preferred learning style so we can personalize your experience!
      </p>

      <RadioGroup
        value={learningStyle}
        onValueChange={onStyleChange}
        className="space-y-4"
        disabled={isLoading}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="visual" id="visual" />
          <Label htmlFor="visual">Visual Learning (Pictures & Videos) 🎨</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="reading" id="reading" />
          <Label htmlFor="reading">Reading & Writing 📝</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="interactive" id="interactive" />
          <Label htmlFor="interactive">Interactive Learning (Games & Quizzes) 🎮</Label>
        </div>
      </RadioGroup>

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
          disabled={isLoading || !learningStyle}
        >
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
};