// Prompt templates for different content types
export const GEMINI_PROMPTS = {
  SYSTEM_PROMPT: `Act as WonderWhiz, a friendly, curious, and highly engaging AI assistant for children aged 5-16. 
Your personality is cheerful, supportive, and endlessly curious. Responses should always:
1. Match the child's age and interests
2. Use simple, fun, and age-appropriate language
3. Ask engaging follow-up questions to spark curiosity
4. Include one emoji per response to keep it playful and engaging
5. Reinforce positivity and encouragement`,

  CHAT_RESPONSE: (age: number, query: string) => `
Generate a chat response for a child aged ${age} who asked: "${query}."
Include:
1. A concise and engaging answer tailored to the child's age
2. A fun fact related to the topic
3. A follow-up question to continue the conversation`,

  CONTENT_BLOCKS: (age: number, topic: string, count: number) => `
Generate ${count} clickable block titles for a child aged ${age} interested in ${topic}.
Each block title should:
1. Be ≤72 characters long
2. Be written as a question, hook, or clickbait-worthy statement
3. Use a fun, age-appropriate tone
4. Include a subtle reference to exploration or discovery
5. Return as a JSON array of objects with title and type properties`,

  QUIZ_QUESTIONS: (age: number, topic: string, count: number) => `
Create ${count} quiz questions for a child aged ${age} on the topic of ${topic}.
Each question should:
1. Be multiple choice (A, B, C)
2. Include one humorous, silly option
3. Provide fun, encouraging feedback for correct and incorrect answers
4. Return as a JSON array of quiz question objects`,

  FOLLOW_UP_SUGGESTIONS: (age: number, topic: string) => `
Generate 3 related topics and 2 follow-up quizzes for a child aged ${age} who completed content about ${topic}.
Ensure:
1. Related topics expand the child's curiosity while staying within their interests
2. Follow-up quizzes build on their learning journey
Return as a JSON object with relatedTopics and followUpQuizzes arrays`,

  GREETING: (name: string, age: number, interests: string[], lastTopic?: string) => `
Generate a personalized greeting for ${name}, aged ${age}, who is interested in ${interests.join(", ")}${lastTopic ? ` and last explored "${lastTopic}"` : ""}.
Include:
1. A cheerful welcome message
2. ${lastTopic ? "A reference to their last topic" : "An exciting hook about one of their interests"}
3. A new suggestion or question to spark curiosity`,

  REWARD_MESSAGE: (name: string, age: number, activity: string, points: number) => `
Create a celebratory message for ${name}, aged ${age}, who completed ${activity} and earned ${points} points.
Include:
1. Excitement and positive reinforcement
2. Mention of the points earned
3. A suggestion for what they can do next`,

  SUPPORT_MESSAGE: (age: number, topic: string) => `
Generate a supportive response for a child aged ${age} who seems frustrated/confused about ${topic}.
Include:
1. Empathy and encouragement
2. A simplified explanation or alternative suggestion
3. A follow-up question to re-engage`,

  ONBOARDING_INTRO: (name: string, age: number) => `
Generate a chat-based onboarding introduction for ${name}, aged ${age}.
Include:
1. A warm, fun greeting
2. Instructions for profile setup
3. A teaser for what they can explore`
};

// Helper function to format the system prompt with the user's context
export const getSystemPrompt = (age: number, interests: string[]) => `
${GEMINI_PROMPTS.SYSTEM_PROMPT}

Current Context:
- Child's Age: ${age}
- Interests: ${interests.join(", ")}
`;

// Helper function to ensure consistent formatting of responses
export const formatGeminiResponse = (response: string): string => {
  // Remove any markdown formatting that might come from the API
  return response
    .replace(/```/g, "")
    .trim();
};