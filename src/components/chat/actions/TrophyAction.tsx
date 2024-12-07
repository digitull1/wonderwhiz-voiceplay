import React from "react";
import { Trophy } from "lucide-react";
import { ActionIcon } from "./ActionIcon";
import { useToast } from "@/hooks/use-toast";

interface TrophyActionProps {
  onPanelOpen?: () => void;
}

export const TrophyAction = ({ onPanelOpen }: TrophyActionProps) => {
  const { toast } = useToast();

  const handlePanelOpen = () => {
    if (onPanelOpen) {
      onPanelOpen();
      toast({
        title: "Progress Panel",
        description: "Check out your learning journey!",
        className: "bg-primary text-white"
      });
    }
  };

  return (
    <ActionIcon
      icon={Trophy}
      tooltip="See your progress!"
      onClick={handlePanelOpen}
      className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5"
    />
  );
};