export interface Block {
  title: string;
  description: string;
  metadata: {
    topic: string;
  };
  color?: string;
}