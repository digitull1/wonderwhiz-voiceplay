import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/types/chat";
import { LoadingAnimation } from "../LoadingAnimation";

interface BlockContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export const BlockContainer: React.FC<BlockContainerProps> = ({
  children,
  isLoading
}) => {
  return (
    <div className="relative w-full px-4 py-2">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl z-50">
          <LoadingAnimation />
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar">
        {children}
      </div>
    </div>
  );
};