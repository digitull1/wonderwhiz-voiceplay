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