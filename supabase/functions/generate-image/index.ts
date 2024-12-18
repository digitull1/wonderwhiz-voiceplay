import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Generating image for prompt:', prompt);

    // Try HuggingFace Flux first
    try {
      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
      const image = await hf.textToImage({
        inputs: prompt,
        model: 'black-forest-labs/FLUX.1-schnell',
      });

      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      return new Response(
        JSON.stringify({ image: `data:image/png;base64,${base64}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error('HuggingFace error:', hfError);
      
      // Fallback to DALL·E
      const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `${prompt} (child-friendly, educational, colorful illustration)`,
          n: 1,
          size: "1024x1024",
        }),
      });

      if (!openaiResponse.ok) {
        throw new Error(`DALL·E API error: ${openaiResponse.statusText}`);
      }

      const data = await openaiResponse.json();
      return new Response(
        JSON.stringify({ image: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});