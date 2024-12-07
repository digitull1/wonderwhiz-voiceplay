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
    return data.response;

  } catch (error) {
    console.error('Error getting Groq response:', error);
    throw new Error('Failed to get a response. Please try again!');
  }
};