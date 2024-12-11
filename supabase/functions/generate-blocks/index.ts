import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const wait = async (ms: number) => {
  console.log(`Waiting ${ms}ms before retry...`);
  await new Promise(resolve => setTimeout(resolve, ms));
  console.log('Wait complete, proceeding with retry');
};

async function retryWithBackoff<T>(operation: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (error.message?.includes('Rate limit reached')) {
        const waitTimeMatch = error.message.match(/try again in (\d+\.?\d*)s/);
        if (waitTimeMatch) {
          const waitTimeSeconds = parseFloat(waitTimeMatch[1]);
          await wait(waitTimeSeconds * 1000);
          continue;
        }
      }
      
      await wait(baseDelay * Math.pow(2, i));
    }
  }
  
  throw lastError;
}

function generateAgeSpecificInstructions(ageGroup: string, language: string = 'en'): string {
  const [minAge, maxAge] = ageGroup.split('-').map(Number);
  
  const instructions = {
    en: {
      young: `For young explorers (${ageGroup} years):
        - Use very simple, playful language
        - Start with fun questions
        - Include magical elements
        - Keep it short and exciting`,
      middle: `For curious minds (${ageGroup} years):
        - Use clear language with some vocabulary
        - Include relatable examples
        - Mix in some jokes
        - Focus on how things work`,
      older: `For young scientists (${ageGroup} years):
        - Use more sophisticated language
        - Include real-world applications
        - Add interesting connections
        - Focus on deeper understanding`
    },
    vi: {
      young: `Cho các nhà thám hiểm nhỏ (${ageGroup} tuổi):
        - Sử dụng ngôn ngữ đơn giản, vui nhộn
        - Bắt đầu với câu hỏi thú vị
        - Thêm yếu tố kỳ diệu
        - Giữ ngắn gọn và hấp dẫn`,
      middle: `Cho tâm trí tò mò (${ageGroup} tuổi):
        - Sử dụng ngôn ngữ rõ ràng
        - Thêm ví dụ thực tế
        - Kết hợp một số câu đùa
        - Tập trung vào cách mọi thứ hoạt động`,
      older: `Cho các nhà khoa học trẻ (${ageGroup} tuổi):
        - Sử dụng ngôn ngữ phức tạp hơn
        - Thêm ứng dụng thực tế
        - Tạo các kết nối thú vị
        - Tập trung vào hiểu sâu`
    }
  };

  const langInstructions = instructions[language] || instructions.en;
  
  if (minAge >= 5 && maxAge <= 7) {
    return langInstructions.young;
  } else if (minAge >= 8 && maxAge <= 11) {
    return langInstructions.middle;
  } else {
    return langInstructions.older;
  }
}

serve(async (req) => {
  console.log(`Received ${req.method} request to generate-blocks`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, age_group = "8-11", language = "en" } = await req.json();
    console.log("Generating blocks for:", { query, context, age_group, language });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = generateAgeSpecificInstructions(age_group, language);
    const prompt = `
      Based on "${query}" and topic "${context}", generate 3 engaging, educational blocks.
      ${ageSpecificInstructions}
      
      Format as JSON with blocks array containing title and metadata.
      Each block must be under 70 characters and include an emoji.
      
      Generate the content in ${language === 'en' ? 'English' : 'Vietnamese'}.
      
      I will append 2 additional blocks for image and quiz after your response.
      Only generate 3 informational blocks.

      Example format:
      {
        "blocks": [
          {
            "title": "🌟 Fun fact about space",
            "metadata": {
              "topic": "space",
              "type": "fact"
            }
          }
        ]
      }
    `;

    const makeRequest = async () => {
      console.log('Making request to Groq API');
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `You are WonderWhiz, generating exciting educational content for kids aged ${age_group}.`
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(errorData.error?.message || "Failed to get response from Groq");
      }

      const data = await response.json();
      console.log('Received response from Groq API:', data);

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from Groq API');
      }

      let parsedContent;
      try {
        parsedContent = typeof data.choices[0].message.content === 'string' 
          ? JSON.parse(data.choices[0].message.content) 
          : data.choices[0].message.content;
      } catch (error) {
        console.error('Error parsing Groq response:', error);
        throw new Error('Failed to parse Groq response');
      }

      if (!parsedContent?.blocks || !Array.isArray(parsedContent.blocks)) {
        console.error('Invalid blocks format:', parsedContent);
        throw new Error('Invalid blocks format in response');
      }

      // Add image and quiz blocks
      const imageBlock = {
        title: `🎨 Create amazing ${context} artwork!`,
        metadata: {
          topic: context,
          type: "image"
        }
      };

      const quizBlock = {
        title: `🎯 Test your ${context} knowledge!`,
        metadata: {
          topic: context,
          type: "quiz"
        }
      };

      // Ensure we only have 3 content blocks before adding image and quiz
      parsedContent.blocks = parsedContent.blocks.slice(0, 3);
      parsedContent.blocks.push(imageBlock, quizBlock);

      return {
        ...data,
        choices: [{
          ...data.choices[0],
          message: {
            ...data.choices[0].message,
            content: JSON.stringify(parsedContent)
          }
        }]
      };
    };

    const data = await retryWithBackoff(makeRequest);
    console.log('Successfully generated blocks');

    return new Response(JSON.stringify(data), { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate blocks',
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }, 
        status: 500
      }
    );
  }
});