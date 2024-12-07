import React from "react";
import { Volume2, Image, Sparkles } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageUpload } from "../ImageUpload";

interface MessageActionsProps {
  onListen?: (text: string) => void;  // Updated to match the parent component's type
  onQuizGenerated?: (quiz: any) => void;
  onImageAnalyzed?: (response: string) => void;
  showActions?: boolean;
  messageText: string;
}

export const MessageActions = ({ 
  onListen, 
  onQuizGenerated,
  onImageAnalyzed,
  showActions = true,
  messageText
}: MessageActionsProps) => {
  if (!showActions) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      {onListen && (
        <ActionIcon
          icon={Volume2}
          tooltip="🔊 Listen to this message!"
          onClick={() => onListen(messageText)}
          className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
        />
      )}

      {onImageAnalyzed && (
        <>
          <ImageUpload 
            onImageAnalyzed={onImageAnalyzed}
            className="hover:scale-110 transition-transform"
          >
            <ActionIcon
              icon={Image}
              tooltip="📸 Share a picture with me!"
              onClick={() => {}}
              className="bg-gradient-to-br from-green-500/5 to-blue-500/5"
            />
          </ImageUpload>

          <ActionIcon
            icon={Sparkles}
            tooltip="✨ Let me create a magical picture for you!"
            onClick={() => {}} // TODO: Implement image generation
            className="bg-gradient-to-br from-purple-500/5 to-pink-500/5"
          />
        </>
      )}

      {onQuizGenerated && (
        <QuizAction
          onQuizGenerated={onQuizGenerated}
          messageText={messageText}
        />
      )}
    </div>
  );
};