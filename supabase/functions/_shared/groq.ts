interface GroqMessage {
  role: string;
  content: string;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseRateLimitError = (error: any) => {
  const match = error.message.match(/try again in (\d+\.?\d*)s/);
  return match ? parseFloat(match[1]) * 1000 : 1000; // Default to 1s if no time found
};

export const callGroq = async (messages: GroqMessage[], temperature = 0.7, maxTokens = 500, retries = 3) => {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      console.log(`Attempt ${attempt + 1} of ${retries} to call Groq API`);
      
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
        
        if (errorData.error?.message?.includes('Rate limit reached')) {
          const waitTime = parseRateLimitError(errorData.error);
          console.log(`Rate limit hit, waiting for ${waitTime}ms before retry`);
          await wait(waitTime);
          attempt++;
          continue;
        }
        
        throw new Error(errorData.error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log('Successfully received response from Groq');
      return data;
      
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries - 1) {
        throw error;
      }
      
      // Exponential backoff for other errors
      const backoffTime = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`Waiting ${backoffTime}ms before retry`);
      await wait(backoffTime);
      attempt++;
    }
  }
  
  throw new Error(`Failed after ${retries} attempts`);
};