export interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
    type?: 'fact' | 'image' | 'quiz';
  };
  color?: string;
}

export interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
}

export interface UserProfile {
  id?: string;  // Added optional id to match Supabase profiles table
  name: string;
  age: number;
  language: string;  // Added language property
  gender: string;    // Added gender property
  topics_of_interest?: string[];
  preferred_language?: string;
}

export interface UserProgress {
  points: number;
  level: number;
  streak_days: number;
  last_interaction_date: string;
  topicsExplored: number;
  questionsAsked: number;
  quizScore: number;
  recentTopics?: string[];
}

export interface QuizState {
  isActive: boolean;
  currentQuestion: QuizQuestion | null;
  blocksExplored: number;
  currentTopic: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}
