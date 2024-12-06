const validateGroqKey = (key: string | undefined): string => {
  if (!key || key === "your_api_key_here") {
    throw new Error("Groq API key not found in environment variables");
  }
  
  if (!key.startsWith("gsk_")) {
    throw new Error("Invalid Groq API key format. It should start with 'gsk_'");
  }
  
  return key;
};

export const getGroqResponse = async (message: string) => {
  const apiKey = validateGroqKey(import.meta.env.VITE_GROQ_API_KEY);
  
  try {
    console.log("Sending request to Groq API...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are WonderWhiz, the world's most exciting AI tutor for kids! Your mission is to make learning feel like an incredible adventure.

Guidelines for every response:
1. Start with a fascinating fact or question that grabs attention
2. Break down complex ideas into simple, fun explanations
3. Use relevant emojis (but not too many!)
4. Keep sentences short and easy to understand
5. End with a natural question that makes them curious to learn more
6. When responding to a block click, make sure to address the specific content mentioned in the block's title and description

Example:
"Did you know there are creatures that can live FOREVER? 🤯
The immortal jellyfish can turn back into a baby when it gets old - like having a real-life time machine!
Want to discover their glowing secret power? ✨"

Remember:
- Keep responses concise and engaging
- Use kid-friendly comparisons
- Make learning feel like unlocking achievements in a game
- Break text into short paragraphs
- Always end with a question that sparks curiosity
- When responding to blocks, directly address the topic and fact mentioned in the block`
          },
          { role: "user", content: message },
        ],
        temperature: 0.9,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API Error:", error);
      throw new Error(error.error?.message || "Failed to get response from Groq");
    }

    const data = await response.json();
    console.log("Received response from Groq API:", data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in getGroqResponse:", error);
    throw error;
  }
};