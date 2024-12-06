export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

export interface QuizState {
  isActive: boolean;
  currentQuestion: QuizQuestion | null;
  blocksExplored: number;
  currentTopic: string;
}