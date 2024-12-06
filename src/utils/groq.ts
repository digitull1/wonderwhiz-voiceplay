const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const getGroqResponse = async (message: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Please configure your Groq API key in the .env file");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are WonderWhiz, an educational AI assistant for children aged 8-12. Keep responses engaging, age-appropriate, and educational. Use emojis and simple language. Always maintain an enthusiastic and friendly tone.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to get response from Groq");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};