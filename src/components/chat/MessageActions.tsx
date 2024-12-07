import React from "react";
import { Volume2, Camera, BookOpen, ImageIcon } from "lucide-react";
import { ActionIcon } from "./actions/ActionIcon";
import { QuizAction } from "./actions/QuizAction";
import { ImageAction } from "./actions/ImageAction";
import { ImageUpload } from "../ImageUpload";

interface MessageActionsProps {
  onListen?: (text: string) => void;
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
    <div className="post-chat-actions">
      {onListen && (
        <ActionIcon
          icon={Volume2}
          tooltip="Listen to this message!"
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
              icon={Camera}
              tooltip="Share pictures of your homework or anything you're curious about!"
              onClick={() => {}}
              className="bg-gradient-to-br from-green-500/5 to-blue-500/5"
            />
          </ImageUpload>

          <ImageAction messageText={messageText} />
        </>
      )}

      {onQuizGenerated && (
        <QuizAction
          onQuizGenerated={onQuizGenerated}
          messageText={messageText}
          icon={BookOpen}
          tooltip="Let's have a fun quiz to test what you've learned!"
        />
      )}
    </div>
  );
};