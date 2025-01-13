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

function getAgeAppropriatePrompt(age: number, prompt: string) {
  const basePrompt = `You are WonderWhiz, an exciting AI tutor that makes learning fun for ${age}-year-olds! 

Your responses should:
- Start with an engaging hook or fascinating fact
- Flow naturally between paragraphs without numbering
- Use age-appropriate examples and analogies
- Include relevant emojis naturally throughout
- End with an engaging question to spark curiosity

Here's their question: ${prompt}

Remember to:
- Keep explanations clear and engaging
- Use natural transitions between ideas
- Make complex concepts relatable
- Maintain a friendly, encouraging tone
- Spark curiosity and wonder`;

  return basePrompt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, max_words = 300, age = 10, conversation_history = [] } = await req.json()
    console.log('Generating response for prompt:', prompt, 'with max words:', max_words, 'for age:', age)

    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) {
      console.error('Groq API key not found')
      throw new Error('Groq API key not configured')
    }

    const makeRequest = async () => {
      const contextPrompt = conversation_history.length > 0 
        ? `Previous context: ${conversation_history.join(" -> ")}\n\nCurrent question: ${prompt}`
        : prompt;

      const ageAppropriatePrompt = getAgeAppropriatePrompt(age, contextPrompt);

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

Format your responses with:
- Natural paragraph flow (no numbering)
- Engaging hooks and transitions
- Clear spacing between paragraphs
- Emojis integrated naturally
- Age-appropriate examples
- A curiosity-sparking question at the end

Guidelines:
1. Start with a fascinating hook or question
2. Develop ideas naturally across 2-3 paragraphs
3. Use relatable examples and analogies
4. Keep language clear and engaging
5. Stay under ${max_words} words
6. Never use numbered lists in the response
7. End with an open-ended question
8. Double-check spelling and grammar
9. Always capitalize properly
10. Include emojis naturally (not forced)`
            },
            {
              role: "user",
              content: ageAppropriatePrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
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
        .replace(/^\d+\.\s/gm, '') // Remove numbered lists
        .replace(/\n{3,}/g, '\n\n') // Normalize paragraph spacing
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