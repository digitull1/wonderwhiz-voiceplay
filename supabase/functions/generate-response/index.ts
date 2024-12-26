import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  baseDelay = 1000,
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (error.message?.includes('Rate limit reached')) {
        // Extract wait time from error message
        const waitTime = parseFloat(error.message.match(/try again in (\d+\.?\d*)s/)?.[1] || '1') * 1000;
        console.log(`Rate limit hit, waiting for ${waitTime}ms before retry ${i + 1}`);
        await wait(waitTime);
      } else {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Operation failed, retrying in ${delay}ms (attempt ${i + 1})`);
        await wait(delay);
      }
    }
  }
  
  throw lastError;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, max_words = 100 } = await req.json()
    console.log('Generating response for prompt:', prompt, 'with max words:', max_words)

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) {
      console.error('Groq API key not found')
      throw new Error('Groq API key not configured')
    }

    const makeRequest = async () => {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `You are WonderWhiz, an exciting AI tutor that makes learning fun for kids!
              Keep your responses:
              1. Under ${max_words} words
              2. Educational and engaging
              3. Simple enough for children
              4. Limited to ONE emoji at the end of the response (not in the middle)
              5. With proper spacing (no double line breaks)
              6. Never include undefined or null in your responses
              7. Double-check spelling and grammar
              8. Always capitalize the first letter of every sentence`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Groq API Error:", error);
        throw new Error(error.error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log("Raw response from Groq:", data);
      
      const content = data.choices[0]?.message?.content || "";
      if (!content) {
        throw new Error("Empty response from Groq");
      }

      // Clean up the response
      const cleanedContent = content
        .replace(/undefined|null/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      data.choices[0].message.content = cleanedContent;
      return data;
    };

    const data = await retryWithBackoff(makeRequest);
    console.log("Final processed response:", data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})