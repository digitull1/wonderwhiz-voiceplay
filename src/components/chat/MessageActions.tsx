import React from "react";
import { Volume2, Image as ImageIcon, Sparkles } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageUpload } from "../ImageUpload";

interface MessageActionsProps {
  onListen?: () => void;
  onQuizGenerated?: () => void;
  onImageAnalyzed?: (response: string) => void;
  showActions?: boolean;
}

export const MessageActions = ({ 
  onListen, 
  onQuizGenerated,
  onImageAnalyzed,
  showActions = true 
}: MessageActionsProps) => {
  if (!showActions) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      {onListen && (
        <ActionIcon
          icon={Volume2}
          tooltip="Listen to this message"
          onClick={onListen}
          className="bg-gradient-to-br from-blue-500/5 to-purple-500/5"
        />
      )}

      {onImageAnalyzed && (
        <>
          <ImageUpload 
            onImageAnalyzed={onImageAnalyzed}
            className="hover:scale-110 transition-transform"
          >
            <ActionIcon
              icon={ImageIcon}
              tooltip="Upload homework photo"
              onClick={() => {}} // Empty function since click is handled by ImageUpload
              className="bg-gradient-to-br from-green-500/5 to-blue-500/5"
            />
          </ImageUpload>

          <ActionIcon
            icon={Sparkles}
            tooltip="Generate an image"
            onClick={() => {}} // TODO: Implement image generation
            className="bg-gradient-to-br from-purple-500/5 to-pink-500/5"
          />
        </>
      )}

      {onQuizGenerated && (
        <QuizAction
          onQuizGenerated={onQuizGenerated}
          messageText="" // Add the required messageText prop
          className="bg-gradient-to-br from-orange-500/5 to-red-500/5"
        />
      )}
    </div>
  );
};