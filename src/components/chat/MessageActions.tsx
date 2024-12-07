import React from "react";
import { Volume2, Image, Sparkles, BookOpen } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageUpload } from "../ImageUpload";

interface MessageActionsProps {
  onListen?: () => void;
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
          onClick={() => onListen()}
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
              tooltip="📸 Upload your homework or any picture you want to learn about!"
              onClick={() => {}} // Handled by ImageUpload
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