import { supabase } from "@/integrations/supabase/client";

export const getGroqResponse = async (prompt: string, maxWords: number = 100) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        prompt: `${prompt}\n\nPlease keep your response under ${maxWords} words and make it engaging for children.`,
        max_words: maxWords
      }
    });

    if (error) throw error;
    
    // Ensure we have a valid response
    if (!data?.response) {
      throw new Error('Invalid response format received');
    }

    // Clean up any potential undefined values and trim whitespace
    const cleanResponse = data.response.replace(/undefined|null/g, '').trim();
    console.log('Cleaned response:', cleanResponse);
    
    return cleanResponse;

  } catch (error) {
    console.error('Error getting Groq response:', error);
    throw new Error('Failed to get a response. Please try again!');
  }
};