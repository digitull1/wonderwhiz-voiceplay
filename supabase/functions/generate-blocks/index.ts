import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateAgeSpecificInstructions = (ageGroup: string) => {
  console.log('Generating age-specific instructions for:', ageGroup);
  const [minAge, maxAge] = ageGroup.split('-').map(Number);
  
  if (minAge <= 7) {
    return "Create simple, fun blocks with basic concepts and lots of emojis!";
  } else if (minAge <= 11) {
    return "Create engaging blocks with interesting facts and relatable examples!";
  } else {
    return "Create informative blocks with real-world applications and deeper concepts!";
  }
};

serve(async (req) => {
  console.log('Received request to generate-blocks function');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, age_group = "8-11" } = await req.json();
    console.log('Generating blocks for:', { query, context, age_group });

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const ageSpecificInstructions = generateAgeSpecificInstructions(age_group);
    const prompt = `
      Based on "${query}" and topic "${context}", generate EXACTLY 3 engaging, educational blocks.
      ${ageSpecificInstructions}
      
      Format as JSON with blocks array containing title and metadata.
      Each block must be under 70 characters and include an emoji.
      
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
    console.log('Received response from Groq API');

    if (!data?.choices?.[0]?.message?.content) {
      console.error('Invalid response format from Groq API');
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

    // Ensure we only have 3 content blocks
    parsedContent.blocks = parsedContent.blocks.slice(0, 3);

    // Add image and quiz blocks with the specific topic
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

    // Add the image and quiz blocks
    parsedContent.blocks.push(imageBlock, quizBlock);

    console.log('Final blocks structure:', parsedContent);

    return new Response(
      JSON.stringify({
        ...data,
        choices: [{
          ...data.choices[0],
          message: {
            ...data.choices[0].message,
            content: JSON.stringify(parsedContent)
          }
        }]
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blocks function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate blocks',
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});