interface GroqMessage {
  role: string;
  content: string;
}

export const callGroq = async (messages: GroqMessage[], temperature = 0.7, maxTokens = 500) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Groq API error:', errorData);
    throw new Error(errorData.error?.message || "Failed to get response from Groq");
  }

  return await response.json();
}