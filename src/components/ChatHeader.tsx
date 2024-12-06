import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Trophy, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ChatHeader = () => {
  const [userProgress, setUserProgress] = useState({
    points: 0,
    level: 1,
    streak_days: 0
  });

  useEffect(() => {
    const fetchUserProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserProgress(data);
      }
    };

    fetchUserProgress();
  }, []);

  return (
    <motion.div 
      className="flex justify-between items-center mb-6 bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 relative">
        <motion.div
          className="relative"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <div className="flex flex-col">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            WonderWhiz
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your magical learning companion ✨
          </motion.p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.4 }}
        >
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Level {userProgress.level}</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <Zap className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-secondary">{userProgress.points} Points</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.6 }}
        >
          <Trophy className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-500">{userProgress.streak_days} Day Streak</span>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl" />
    </motion.div>
  );
};