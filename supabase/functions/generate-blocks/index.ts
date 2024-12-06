import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('Groq');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, age_group, name, depth } = await req.json();
    
    console.log('Generating blocks for:', { query, context, age_group, depth, name });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping generate engaging educational blocks for children. 
            Based on the query and context, generate 3 relevant subtopics that would interest a child in the ${age_group} age group.
            Each block should have an emoji and be presented in a fun, engaging way.
            The response should be in JSON format with an array of blocks, each containing a title, description, and metadata.topic field.
            Make the content appropriate for ${name ? name + "'s" : "a child's"} age group (${age_group}).`
          },
          { 
            role: "user", 
            content: `Generate blocks for query: "${query}" at depth level ${depth}. Context: ${context}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', await response.text());
      throw new Error('Failed to generate blocks from Groq API');
    }

    const data = await response.json();
    console.log('Generated blocks:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to generate blocks" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});