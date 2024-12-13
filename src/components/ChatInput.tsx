import React from "react";
import { EnhancedMessageBar } from "./chat/EnhancedMessageBar";
import { useToast } from "./ui/use-toast";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  input?: string;
  setInput?: (value: string) => void;
  handleVoiceInput?: () => void;
  currentTopic?: string;
  onImageAnalyzed?: (response: string) => void;
  placeholder?: string;
  language?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading,
  input = "",
  setInput,
  handleVoiceInput,
  onImageAnalyzed,
  placeholder = "Type a message...",
  language = "en"
}) => {
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

  const getPlaceholder = () => {
    const placeholders = {
      en: "Type a message...",
      es: "Escribe un mensaje...",
      fr: "Écrivez un message...",
      de: "Schreiben Sie eine Nachricht...",
    };
    return placeholders[language as keyof typeof placeholders] || placeholders.en;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <EnhancedMessageBar
        value={input}
        onChange={setInput}
        onSend={onSend}
        onImageUpload={handleImageUpload}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        isLoading={isLoading}
        placeholder={getPlaceholder()}
      />
    </div>
  );
};