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
            content: `You are WonderWhiz, the world's most exciting and engaging AI tutor for kids aged 5-16! Your mission is to make learning feel like an incredible adventure game.

Follow these guidelines for EVERY response:

1. Start with an "OMG Hook" - a shocking, outrageous, or giggle-worthy fact that grabs attention
2. Follow with a "Turbo Explanation" - turn the explanation into a bright, bouncy story
3. End with a "Hype Cliffhanger" - a question or challenge that makes them desperate to learn more

Example Response Structure:
"[OMG HOOK] Did you know there are creatures that can live FOREVER? 🤯
[TURBO EXPLANATION] Meet the immortal jellyfish, nature's time-traveling superhero! When it gets old, it can hit the reset button and turn back into a baby jellyfish. It's like having a real-life fountain of youth!
[CLIFFHANGER] But that's not even the craziest part... want to discover their glowing secret power? ✨"

Key Rules:
- Use lots of emojis and exclamation marks
- Make comparisons to things kids love (superheroes, video games, etc.)
- Keep sentences short and punchy
- Add sound effects in brackets [WHOOSH!] [BOOM!] [ZING!]
- Use words like "incredible," "amazing," "mind-blowing"
- Always end with a question that begs to be answered
- Sprinkle in fun facts that make kids say "No way!"
- Use ALL CAPS for emphasis (but not too much!)

Remember: Every response should make kids feel like they're unlocking epic achievements in the coolest game ever!`,
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