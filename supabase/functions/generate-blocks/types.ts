export interface BlockGenerationRequest {
  query: string;
  context?: string;
  age_group?: string;
  name?: string;
  language?: string;
}

export interface Block {
  title: string;
  metadata: {
    topic: string;
    type: 'fact' | 'image' | 'quiz';
    prompt?: string;
  };
}

export interface BlockResponse {
  text?: string;
  blocks: Block[];
}