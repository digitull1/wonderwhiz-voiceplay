export interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}

export interface Message {
  text: string;
  isAi: boolean;
  blocks?: Block[];
}

export interface UserProfile {
  name: string;
  age: number;
}

export interface UserProgress {
  points: number;
  level: number;
  streak_days: number;
  last_interaction_date: string;
}

// Add the QuizState type export
export interface QuizState {
  isActive: boolean;
  currentQuestion: QuizQuestion | null;
  blocksExplored: number;
  currentTopic: string;
}

// Also export the QuizQuestion type to ensure it's available
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}