import React, { useState, useRef, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedMessageBarProps {
  onSend: (message: string) => void;
  onImageUpload?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const EnhancedMessageBar: React.FC<EnhancedMessageBarProps> = ({
  onSend,
  onImageUpload,
  onVoiceCall,
  onVideoCall,
  isLoading,
  value = "",
  onChange,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessage(value);
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    onChange?.(newValue);
    
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
      onChange?.("");
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
    <motion.div 
      className="flex items-end gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 bg-primary/10 hover:bg-primary/20"
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
        placeholder={placeholder}
        className={cn(
          "min-h-[40px] w-full resize-none bg-background px-4 py-2 focus-visible:ring-0",
          "rounded-md border transition-all duration-200",
          "max-h-[150px] overflow-y-auto"
        )}
        rows={1}
      />

      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};