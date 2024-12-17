import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { BlockResponse } from './types.ts';
import { getFallbackBlocks } from './fallbackContent.ts';

export const initializeGemini = (apiKey: string): GoogleGenerativeAI | null => {
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Error initializing Gemini:', error);
    return null;
  }
};

export const generateContent = async (
  model: any,
  prompt: string,
  context: string
): Promise<BlockResponse> => {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('Generated content:', text);
    
    let response;
    try {
      response = typeof text === 'string' ? JSON.parse(text) : text;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return getFallbackBlocks(context);
    }

    return response;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
      throw new Error('RATE_LIMIT');
    }
    return getFallbackBlocks(context);
  }
};