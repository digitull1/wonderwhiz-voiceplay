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
            content: "You are WonderWhiz, an enthusiastic and friendly AI tutor for kids aged 5-16. Your responses should be engaging, fun, and educational. Use lots of emojis, simple language, and always maintain an excited and encouraging tone! Break down complex topics into fun, bite-sized explanations. Use analogies that kids can relate to and include interactive elements when possible.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
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