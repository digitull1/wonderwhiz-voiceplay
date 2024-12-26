import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TopicSelection } from "./TopicSelection";

interface ChildFormProps {
  name: string;
  age: string;
  selectedTopics: string[];
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onTopicToggle: (topicId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const ChildForm: React.FC<ChildFormProps> = ({
  name,
  age,
  selectedTopics,
  onNameChange,
  onAgeChange,
  onTopicToggle,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Child's Profile</h2>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Child's name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="4"
          max="12"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          placeholder="Age (4-12)"
          required
        />
      </div>

      <TopicSelection
        selectedTopics={selectedTopics}
        onTopicToggle={onTopicToggle}
      />

      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button"
          className="flex-1"
          onClick={onSubmit}
        >
          Complete Registration
        </Button>
      </div>
    </div>
  );
};