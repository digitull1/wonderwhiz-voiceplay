import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getAgeSpecificInstructions(ageGroup: string): string {
  const [minAge] = ageGroup.split('-').map(Number);
  
  if (minAge <= 7) {
    return `
      Create a cute, friendly cartoon-style illustration that is:
      - Simple and colorful with clear shapes
      - Playful and magical in appearance
      - Safe and gentle for young children
      - Includes fun, happy elements
      - Uses bright, cheerful colors
      - Avoids any scary or complex elements
    `;
  } else if (minAge <= 11) {
    return `
      Create a colorful, engaging illustration that is:
      - Detailed but still fun and approachable
      - Educational with interesting details
      - Uses relatable comparisons
      - Includes elements of wonder and discovery
      - Maintains scientific accuracy while being engaging
      - Safe and appropriate for curious minds
    `;
  } else {
    return `
      Create a detailed educational illustration that is:
      - More sophisticated in style
      - Scientifically accurate
      - Shows real-world relevance
      - Includes interesting technical details
      - Maintains engagement while being informative
      - Age-appropriate for young teens
    `;
  }
}

async function generateWithHuggingFace(prompt: string) {
  console.log('Attempting HuggingFace generation...');
  const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  if (!hfToken) {
    throw new Error('HuggingFace access token not configured');
  }
  
  const hf = new HfInference(hfToken);
  console.log('Sending request to FLUX model...');
  
  const image = await hf.textToImage({
    inputs: prompt,
    model: 'black-forest-labs/FLUX.1-schnell',
  });

  console.log('Image received from HuggingFace, converting to base64...');
  const arrayBuffer = await image.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  console.log('HuggingFace generation successful');
  
  return `data:image/png;base64,${base64}`;
}

async function generateWithOpenAI(prompt: string, minAge: number) {
  console.log('Attempting OpenAI DALL-E generation...');
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: minAge <= 7 ? "vivid" : "natural"
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('OpenAI API error:', error);
    throw new Error(error.error?.message || 'Failed to generate image with OpenAI');
  }

  const data = await response.json();
  console.log('OpenAI generation successful');
  return data.data[0].url;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, age_group = "8-12" } = await req.json();
    console.log('Generating image for prompt:', prompt, 'age group:', age_group);

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt provided');
    }

    const styleInstructions = getAgeSpecificInstructions(age_group);
    const formattedPrompt = `
      ${styleInstructions}
      
      Create an illustration of: ${prompt.slice(0, 200)}
      Make it educational, engaging, and perfectly suited for children aged ${age_group}.
    `.slice(0, 500);
    
    console.log('Formatted prompt:', formattedPrompt);
    let imageUrl;

    try {
      // Try HuggingFace first
      imageUrl = await generateWithHuggingFace(formattedPrompt);
    } catch (hfError) {
      console.error('HuggingFace generation failed:', hfError);
      console.log('Falling back to OpenAI...');
      
      // Extract minAge for style selection
      const [minAge] = age_group.split('-').map(Number);
      
      // Fallback to OpenAI
      imageUrl = await generateWithOpenAI(formattedPrompt, minAge);
    }

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate image';
    let errorDetails = error.message;
    
    if (error.message.includes('billing')) {
      errorMessage = 'Service temporarily unavailable';
      errorDetails = 'Please try again in a few minutes';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        details: errorDetails,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});