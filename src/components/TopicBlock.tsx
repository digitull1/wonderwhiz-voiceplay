import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TopicBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const TopicBlock: React.FC<TopicBlockProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex flex-col items-start p-4 rounded-xl w-[280px] h-[160px] transition-all hover:scale-105",
        color
      )}
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-bold mb-1 text-left">{title}</h3>
      <p className="text-sm text-left opacity-90">{description}</p>
    </Button>
  );
};