const validateGroqKey = (key: string | null): string => {
  if (!key) {
    throw new Error("Please enter your Groq API key in the settings!");
  }
  if (!key.startsWith("gsk_")) {
    throw new Error("Invalid Groq API key format. It should start with 'gsk_'");
  }
  return key;
};

export const getGroqResponse = async (message: string) => {
  const apiKey = validateGroqKey(localStorage.getItem("groq-key"));

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
          content: "You are WonderWhiz, an enthusiastic and friendly AI tutor for kids aged 5-16. Your responses should be engaging, fun, and educational. Use emojis and simple language, and always maintain an excited and encouraging tone!",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to get response from Groq");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};