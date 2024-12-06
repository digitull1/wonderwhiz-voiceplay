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
    console.log("Sending request to Groq API with message:", message);
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

When responding to a block click (message starting with "Tell me about"), focus specifically on explaining the fact or topic mentioned in the block's title and description. For example, if the block mentions "a planet where it rains diamonds", your response should directly address and explain this fascinating fact.

Guidelines for every response:
1. Start with an exciting "Did you know?" fact that directly relates to the topic
2. Break down complex ideas into simple, fun explanations using analogies kids can understand
3. Use relevant emojis to make key points stand out (but not too many!)
4. Keep sentences short and easy to understand (max 15 words per sentence)
5. End with a natural question that makes them curious to learn more
6. Always address the specific content mentioned in block clicks

Example response structure:
"Did you know that on planet WASP-121b, it actually rains liquid rubies and sapphires? 💎
That's right! This planet is so hot that gems turn into sparkly rain drops!
Just imagine looking up and seeing precious stones falling from the sky! ✨
Want to discover what other treasures we might find in space? 🚀"

Remember:
- Keep responses concise (3-4 short paragraphs max)
- Use kid-friendly comparisons
- Make learning feel like unlocking achievements in a game
- Break text into short paragraphs
- Always end with a question that sparks curiosity
- For block clicks, directly explain the specific fact mentioned`
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
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq API");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in getGroqResponse:", error);
    throw error;
  }
};