interface GroqMessage {
  role: string;
  content: string;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseRateLimitError = (error: any) => {
  const match = error.message?.match(/try again in (\d+\.?\d*)s/);
  return match ? parseFloat(match[1]) * 1000 : 1000;
};

const isRateLimitError = (error: any) => {
  return error?.message?.includes('Rate limit reached') || 
         error?.error?.message?.includes('Rate limit reached');
};

export const callGroq = async (messages: GroqMessage[], temperature = 0.7, maxTokens = 500, retries = 5) => {
  let attempt = 0;
  let lastError: any = null;
  
  while (attempt < retries) {
    try {
      console.log(`[Groq API] Attempt ${attempt + 1} of ${retries}`);
      
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

      const responseText = await response.text();
      console.log(`[Groq API] Raw response: ${responseText}`);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        
        console.error('[Groq API] Error response:', errorData);
        
        if (isRateLimitError(errorData)) {
          const waitTime = parseRateLimitError(errorData.error || errorData);
          console.log(`[Groq API] Rate limit hit, waiting ${waitTime}ms before retry`);
          await wait(waitTime);
          attempt++;
          lastError = errorData;
          continue;
        }
        
        throw new Error(errorData.error?.message || errorData.message || "Failed to get response from Groq");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('[Groq API] Failed to parse JSON response:', e);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log('[Groq API] Successfully received and parsed response');
      return data;
      
    } catch (error) {
      lastError = error;
      console.error(`[Groq API] Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries - 1) {
        console.error('[Groq API] All retry attempts failed. Last error:', lastError);
        throw new Error(`Failed after ${retries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
      }
      
      // Exponential backoff with jitter
      const baseDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
      const jitter = Math.random() * 1000;
      const backoffTime = baseDelay + jitter;
      
      console.log(`[Groq API] Waiting ${backoffTime}ms before retry`);
      await wait(backoffTime);
      attempt++;
    }
  }
  
  throw new Error(`Failed after ${retries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
};