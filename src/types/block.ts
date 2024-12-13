export interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
    type?: 'fact' | 'image' | 'quiz';
    prompt?: string;
  };
  color?: string;
}