import React from "react";
import { motion } from "framer-motion";

interface GeneratedImageProps {
  imageUrl: string;
}

export const GeneratedImage = ({ imageUrl }: GeneratedImageProps) => (
  <motion.img
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    src={imageUrl}
    alt="Generated content"
    className="w-full rounded-lg shadow-lg"
  />
);