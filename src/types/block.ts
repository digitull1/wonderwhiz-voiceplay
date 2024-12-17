export interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
    type: 'fact' | 'image' | 'quiz';
    prompt?: string;
    age_group?: string;
    follow_up?: string[];
  };
  color?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface ContentResponse {
  text: string;
  blocks?: Block[];
  imageUrl?: string;
  quiz?: QuizQuestion[];
}