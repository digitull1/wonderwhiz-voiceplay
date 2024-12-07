import React from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TrophyActionProps {
  onPanelOpen?: () => void;
}

export const TrophyAction = ({ onPanelOpen }: TrophyActionProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (onPanelOpen) {
      console.log('Opening progress panel...');
      onPanelOpen();
      toast({
        title: "Progress Panel",
        description: "Check out your learning journey!",
        className: "bg-primary text-white",
      });
    } else {
      console.error('onPanelOpen callback is not defined');
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "hover:bg-white hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
      )}
    >
      <Trophy className="w-4 h-4" />
    </Button>
  );
};