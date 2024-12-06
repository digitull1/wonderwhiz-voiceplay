import React from "react";
import { Button } from "./ui/button";
import { Volume2, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBlocks } from "./ChatBlocks";
import { ImageGenerator } from "./ImageGenerator";
import { cn } from "@/lib/utils";

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

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  isAi, 
  message, 
  onListen,
  blocks,
  onBlockClick 
}) => {
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

  // Format message by adding line breaks after sentences and emojis
  const formattedMessage = message
    .split(/([.!?])\s+/)
    .map((part, i, arr) => i < arr.length - 1 ? part + arr[i + 1] : part)
    .filter((_, i) => i % 2 === 0)
    .join('\n');

  const blockTransitionText = blocks?.length 
    ? "Want to explore more? Check these out! ✨" 
    : "";

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
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-purple-500 
              to-purple-600 flex items-center justify-center shadow-lg relative flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}

        <motion.div
          className={cn(
            "space-y-4 p-5 rounded-2xl shadow-lg relative overflow-hidden",
            isAi
              ? "bg-gradient-to-br from-primary/90 via-purple-500/90 to-purple-600/90 text-white"
              : "bg-gradient-to-br from-secondary/90 via-green-500/90 to-green-600/90 text-white"
          )}
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative z-10">
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {formattedMessage}
            </p>
            
            {isAi && (
              <motion.div 
                className="flex flex-col gap-3 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex gap-2">
                  {onListen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white/80 hover:bg-white/10 group"
                      onClick={onListen}
                    >
                      <Volume2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      Listen
                    </Button>
                  )}
                  
                  {shouldShowImageGen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white/80 hover:bg-white/10 group"
                    >
                      <Image className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      Generate Picture
                    </Button>
                  )}
                </div>
                
                {shouldShowImageGen && <ImageGenerator prompt={message} />}
                
                {blocks && blocks.length > 0 && onBlockClick && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm mb-3 italic">
                      {blockTransitionText}
                    </p>
                    <ChatBlocks blocks={blocks} onBlockClick={onBlockClick} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-white rounded-full 
              transform translate-x-16 -translate-y-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-24 h-24 opacity-10 bg-white rounded-full 
              transform -translate-x-12 translate-y-12"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
