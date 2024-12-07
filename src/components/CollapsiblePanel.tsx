import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, History, Star, X, MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CollapsiblePanelProps {
  userProgress: {
    points: number;
    level: number;
    streak_days: number;
  };
}

export const CollapsiblePanel = ({ userProgress }: CollapsiblePanelProps) => {
  const [timeSpent] = React.useState({
    today: 30, // Example value in minutes
    week: 120, // Example value in minutes
  });

  const recentTopics = [
    { name: "Solar System", emoji: "🌎" },
    { name: "Famous Inventors", emoji: "💡" },
    { name: "Tropical Rainforests", emoji: "🌴" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg
            hover:shadow-xl transition-all duration-300 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star className="w-6 h-6 text-primary" />
        </motion.button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[400px] bg-gradient-to-br from-purple-50 to-blue-50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            Your Progress
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Points & Level Section */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-primary">Level {userProgress.level}</h3>
                <p className="text-sm text-gray-600">⭐ {userProgress.points} Points</p>
                <p className="text-sm text-gray-600">🔥 {userProgress.streak_days} Day Streak</p>
              </div>
              <Star className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </motion.div>

          {/* Time Tracker */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Time Spent Learning</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="text-sm font-medium">{timeSpent.today} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full"
                  style={{ width: `${(timeSpent.today / 60) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="text-sm font-medium">{timeSpent.week} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full"
                  style={{ width: `${(timeSpent.week / 300) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Recent Topics */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Recent Topics</h3>
            </div>
            <div className="space-y-2">
              {recentTopics.map((topic, index) => (
                <motion.button
                  key={topic.name}
                  className="w-full text-left p-2 rounded-lg hover:bg-white/50 
                    transition-colors duration-200 flex items-center gap-2"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">{topic.emoji}</span>
                  <span className="text-sm font-medium">{topic.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Talk to Wizzy Widget */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Talk to Wizzy</h3>
            </div>
            <div className="w-full h-[300px] rounded-lg overflow-hidden">
              <elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};