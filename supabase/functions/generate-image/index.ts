import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Starting image generation request');
    
    let body;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      body = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({
          error: 'Invalid request format',
          details: 'Request body must be valid JSON',
          success: false
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Parsed request body:', body);

    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt',
          details: 'Prompt must be a non-empty string',
          success: false
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Format the prompt to be more kid-friendly and educational
    // Also limit the length to avoid OpenAI API issues
    const formattedPrompt = `Create a child-friendly, educational illustration of: ${prompt.slice(0, 200)}. Make it colorful, safe, and suitable for children. Style: cute, cartoon-like, educational.`.slice(0, 500);
    console.log('Formatted prompt:', formattedPrompt);

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({
          error: 'Configuration error',
          details: 'OpenAI API key not configured',
          success: false
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Calling OpenAI DALL-E 3 API');
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: formattedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
        style: "natural"
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('OpenAI API Error:', error);
      
      // Handle specific OpenAI errors
      if (error.error?.code === 'content_policy_violation') {
        return new Response(
          JSON.stringify({
            error: 'Content policy violation',
            details: 'The prompt contains inappropriate content. Please try a different prompt.',
            success: false
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
      
      throw new Error(error.error?.message || 'Failed to generate image');
    }

    const data = await openaiResponse.json();
    console.log('Image generated successfully');

    if (!data.data?.[0]?.b64_json) {
      throw new Error('No image data in response');
    }

    return new Response(
      JSON.stringify({
        image: `data:image/png;base64,${data.data[0].b64_json}`,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate image',
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