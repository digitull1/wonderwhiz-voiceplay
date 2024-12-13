import { corsHeaders } from './cors.ts';

export interface BlockGenerationRequest {
  query: string;
  context?: string;
  age_group?: string;
  name?: string;
  language?: string;
}

export const validateRequest = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    throw new Error(`Method ${req.method} not allowed`);
  }

  const body = await req.json();
  if (!body?.query) {
    throw new Error('Query parameter is required');
  }

  return body as BlockGenerationRequest;
};

export const createFallbackBlocks = (topic: string) => ({
  blocks: [
    {
      title: `🌟 Learn about ${topic}!`,
      metadata: {
        topic: topic,
        type: "fact"
      }
    },
    {
      title: `🎨 Create ${topic} artwork!`,
      metadata: {
        topic: topic,
        type: "image"
      }
    },
    {
      title: `🎯 Test your ${topic} knowledge!`,
      metadata: {
        topic: topic,
        type: "quiz"
      }
    }
  ]
});