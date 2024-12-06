const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const getGroqResponse = async (message: string) => {
  // Get API key from localStorage first, then fallback to env
  const apiKey = localStorage.getItem("groqApiKey") || import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("Please set your Groq API key in the settings");
  }

  if (!apiKey.startsWith('gsk_')) {
    throw new Error("Invalid Groq API key format. It should start with 'gsk_'");
  }

  try {
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
      console.error('Groq API Error:', errorData);
      
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your Groq API key in the settings");
      }
      
      throw new Error(errorData.error?.message || "Failed to get response from Groq");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in getGroqResponse:', error);
    throw error; // Re-throw to be handled by the component
  }
};