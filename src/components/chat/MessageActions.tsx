import React from "react";
import { Button } from "../ui/button";
import { Volume2, Image } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MessageActionsProps {
  onListen?: () => void;
  shouldShowImageGen: boolean;
}

export const MessageActions = ({ onListen, shouldShowImageGen }: MessageActionsProps) => (
  <TooltipProvider>
    <div className="flex gap-2">
      {onListen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 group"
              onClick={onListen}
            >
              <Volume2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Listen
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Listen to WonderWhiz read this message!</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {shouldShowImageGen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary hover:text-secondary/80 hover:bg-secondary/10 group"
            >
              <Image className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Generate Picture
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a magical picture about this topic!</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </TooltipProvider>
);