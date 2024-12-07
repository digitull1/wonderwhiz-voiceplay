import React from "react";
import { Clock } from "lucide-react";

interface TimeTrackerProps {
  timeSpent: {
    today: number;
    week: number;
  };
}

export const TimeTracker = ({ timeSpent }: TimeTrackerProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
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
            className="bg-secondary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(timeSpent.today / 60) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">This Week</span>
          <span className="text-sm font-medium">{timeSpent.week} minutes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-secondary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(timeSpent.week / 300) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};