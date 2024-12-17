import { BlockResponse } from './types.ts';

export const getFallbackBlocks = (topic: string = "general"): BlockResponse => ({
  text: "Let's explore some amazing topics together! 🌟",
  blocks: [
    {
      title: "🌟 Discover fascinating facts about animals in our world!",
      metadata: {
        topic: "animals",
        type: "fact",
        prompt: "Tell me interesting facts about different animals"
      }
    },
    {
      title: "🔬 Learn about amazing science experiments you can try!",
      metadata: {
        topic: "science",
        type: "fact",
        prompt: "Share safe and fun science experiments for kids"
      }
    },
    {
      title: "🌍 Explore incredible places around the world!",
      metadata: {
        topic: "geography",
        type: "fact",
        prompt: "Tell me about interesting places and cultures"
      }
    },
    {
      title: "🎨 Create amazing artwork about nature!",
      metadata: {
        topic: "art",
        type: "image",
        prompt: "Generate a colorful, educational illustration about nature"
      }
    },
    {
      title: "🎯 Test your knowledge with a fun quiz!",
      metadata: {
        topic: "general",
        type: "quiz",
        prompt: "Generate an engaging quiz about general knowledge"
      }
    }
  ]
});