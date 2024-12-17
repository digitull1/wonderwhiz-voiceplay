export const CONTENT_PROMPTS = {
  FACT: (age: number, topic: string) => `
    Generate a short, fun and engaging fact for a ${age}-year-old child about ${topic}.
    Use conversational tone, max 50 words, and make it curiosity-driven.
    Include one follow-up question to encourage further exploration.
  `,

  IMAGE: (topic: string) => `
    Generate a cartoon-style, child-friendly image about ${topic}.
    Make it colorful, fun, and educational.
    Avoid any scary or inappropriate content.
  `,

  QUIZ: (age: number, topic: string) => `
    Generate 5 multiple-choice quiz questions for a ${age}-year-old child about ${topic}.
    Each question should have:
    - 1 correct answer
    - 2 silly/fun distractor options
    Use simple, engaging language suitable for kids.
    Include positive feedback messages for correct/incorrect answers.
  `,

  FOLLOW_UP: (topic: string) => `
    Generate 3 related topics to explore after learning about ${topic}.
    Make them engaging and suitable for children.
    Format as clickable suggestions.
  `
};

export const FEEDBACK_MESSAGES = {
  CORRECT: [
    "🎉 Amazing job! You're a genius explorer!",
    "✨ Wow! You really know your stuff!",
    "🌟 Incredible! Keep up the great work!",
    "🎯 Perfect! You're on fire!",
    "🚀 Outstanding! You're soaring high!"
  ],
  INCORRECT: [
    "Almost there! Want to try again? 💡",
    "Not quite, but you're learning! 🌟",
    "Good try! Let's give it another shot! ✨",
    "Keep exploring! You're getting closer! 🎯",
    "That's a tricky one! Want another try? 🤔"
  ],
  ERROR: {
    IMAGE: "Oops! Something went wrong with the image. Let's try again! 🎨",
    QUIZ: "Hmm, the quiz is being shy. Let's try another topic! 📝",
    CONTENT: "Oops! Let's explore something else exciting! 🌟"
  }
};

export const getRandomFeedback = (type: 'CORRECT' | 'INCORRECT'): string => {
  const messages = FEEDBACK_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};