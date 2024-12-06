import React from "react";
import { Button } from "./ui/button";
import { Volume2, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBlocks } from "./ChatBlocks";
import { ImageGenerator } from "./ImageGenerator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

interface ChatMessageProps {
  isAi?: boolean;
  message: string;
  onListen?: () => void;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
}

export const ChatMessage = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick 
}: ChatMessageProps) => {
  const shouldShowImageGen = message.toLowerCase().includes("look") || 
    message.toLowerCase().includes("see") || 
    message.toLowerCase().includes("picture") ||
    message.toLowerCase().includes("image") ||
    message.toLowerCase().includes("dinosaur") ||
    message.toLowerCase().includes("planet") ||
    message.toLowerCase().includes("animal");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Format message by adding line breaks after sentences
  const formattedMessage = message
    .split(/([.!?])\s+/)
    .map((part, i, arr) => i < arr.length - 1 ? part + arr[i + 1] : part)
    .filter((_, i) => i % 2 === 0)
    .join('\n');

  const handleListenClick = () => {
    if (onListen) {
      try {
        onListen();
      } catch (error) {
        console.error("Error in text-to-speech:", error);
      }
    }
  };

  return (
    <motion.div 
      className={`flex ${isAi ? "justify-start" : "justify-end"} mb-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3 max-w-[80%]">
        {isAi && (
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg relative flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white text-xl">✨</span>
          </motion.div>
        )}

        <motion.div
          className={cn(
            "space-y-4 p-5 rounded-2xl shadow-lg relative overflow-hidden",
            isAi
              ? "bg-chat-ai text-foreground"
              : "bg-chat-user text-foreground"
          )}
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <p className="text-body leading-relaxed whitespace-pre-wrap">
            {formattedMessage}
          </p>
          
          {isAi && (
            <motion.div 
              className="flex flex-col gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TooltipProvider>
                <div className="flex gap-2">
                  {onListen && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 group"
                          onClick={handleListenClick}
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
              
              {shouldShowImageGen && <ImageGenerator prompt={message} />}
              
              {blocks && blocks.length > 0 && onBlockClick && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-small italic mb-3 text-foreground/70">
                    Want to explore more amazing facts? Check these out! ✨
                  </p>
                  <ChatBlocks blocks={blocks} onBlockClick={onBlockClick} />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
