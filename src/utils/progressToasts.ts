import { ToastProps } from "@/components/ui/toast";

export const createLevelUpToast = (newLevel: number): ToastProps => ({
  title: "🎉 LEVEL UP! 🎉",
  description: `Amazing! You've reached level ${newLevel}! Keep exploring to earn more points!`,
  className: "bg-gradient-to-r from-primary to-purple-600 text-white",
});

export const createPointsEarnedToast = (pointsToAdd: number, remainingPoints: number, nextLevel: number): ToastProps => ({
  title: "⭐ Points earned!",
  description: `+${pointsToAdd} points! ${remainingPoints} more to level ${nextLevel}!`,
  className: "bg-gradient-to-r from-secondary to-green-500 text-white",
});

export const createErrorToast = (): ToastProps => ({
  title: "Oops!",
  description: "Couldn't update your progress. Don't worry, keep exploring!",
  variant: "destructive"
});