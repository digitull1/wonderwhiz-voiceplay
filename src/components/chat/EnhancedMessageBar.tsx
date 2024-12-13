import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Image, Video, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedMessageBarProps {
  onSend: (message: string) => void;
  onImageUpload?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  isLoading?: boolean;
}

export const EnhancedMessageBar: React.FC<EnhancedMessageBarProps> = ({
  onSend,
  onImageUpload,
  onVoiceCall,
  onVideoCall,
  isLoading
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onImageUpload}>
            <Image className="mr-2 h-4 w-4" />
            Share Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onVoiceCall}>
            <Mic className="mr-2 h-4 w-4" />
            Voice Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onVideoCall}>
            <Video className="mr-2 h-4 w-4" />
            Video Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className={cn(
          "min-h-[40px] w-full resize-none bg-background px-4 py-2 focus-visible:ring-0",
          "rounded-md border transition-all duration-200"
        )}
        rows={1}
      />

      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="h-9 w-9 shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};