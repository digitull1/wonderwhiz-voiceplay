import React from "react";
import { EnhancedMessageBar } from "./chat/EnhancedMessageBar";
import { useToast } from "./ui/use-toast";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const { toast } = useToast();

  const handleImageUpload = () => {
    toast({
      title: "Coming Soon!",
      description: "Image sharing will be available soon.",
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "Coming Soon!",
      description: "Voice calls will be available soon.",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Coming Soon!",
      description: "Video chat will be available soon.",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <EnhancedMessageBar
        onSend={onSend}
        onImageUpload={handleImageUpload}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        isLoading={isLoading}
      />
    </div>
  );
};