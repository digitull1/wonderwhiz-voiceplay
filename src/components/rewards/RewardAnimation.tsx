import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface RewardAnimationProps {
  points?: number;
  badge?: string;
  type: 'points' | 'badge' | 'streak' | 'quiz' | 'image';
  className?: string;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({
  points,
  badge,
  type,
  className
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#33C3F0', '#FEC6A1', '#7E69AB'],
      shapes: ['circle', 'square'],
    });
  };

  React.useEffect(() => {
    if (type === 'badge' || type === 'quiz') {
      triggerConfetti();
    }
  }, [type]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "pointer-events-none z-50",
          className
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {type === 'points' && (
          <motion.div
            className="text-2xl font-bold text-primary"
            initial={{ y: 0 }}
            animate={{ y: -50 }}
            transition={{ duration: 1 }}
          >
            +{points} points! ⭐
          </motion.div>
        )}

        {type === 'badge' && (
          <motion.div
            className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl shadow-luxury"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1 }}
          >
            <div className="text-white text-center space-y-2">
              <motion.div 
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🏆
              </motion.div>
              <div className="text-lg font-semibold">New Badge!</div>
              <div>{badge}</div>
            </div>
          </motion.div>
        )}

        {type === 'streak' && (
          <motion.div
            className="text-2xl font-bold text-orange-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🔥 Streak!
          </motion.div>
        )}

        {type === 'quiz' && (
          <motion.div
            className="text-2xl font-bold text-green-500"
            initial={{ y: 0 }}
            animate={{ y: -50 }}
            transition={{ duration: 1 }}
          >
            Correct! 🎯
          </motion.div>
        )}

        {type === 'image' && (
          <motion.div
            className="text-2xl font-bold text-purple-500"
            initial={{ y: 0 }}
            animate={{ y: -50 }}
            transition={{ duration: 1 }}
          >
            Creative Genius! 🎨
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};