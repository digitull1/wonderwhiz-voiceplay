import { UserProgress } from "@/types/chat";

export const mapDatabaseToUserProgress = (data: any): UserProgress => {
  return {
    points: data.points,
    level: data.level,
    streak_days: data.streak_days,
    last_interaction_date: data.last_interaction_date,
    topicsExplored: data.topics_explored || 0,
    questionsAsked: data.questions_asked || 0,
    quizScore: data.quiz_score || 0
  };
};

export const getInitialUserProgress = (): UserProgress => ({
  points: 0,
  level: 1,
  streak_days: 0,
  last_interaction_date: new Date().toISOString(),
  topicsExplored: 0,
  questionsAsked: 0,
  quizScore: 0
});