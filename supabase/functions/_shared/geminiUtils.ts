import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

export const generateWithGemini = async (
  prompt: string,
  age_group: string,
  apiKey: string
) => {
  console.log('Generating content with Gemini...', { prompt, age_group });
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const structuredPrompt = `
    You are WonderWhiz, an AI assistant for children aged ${age_group}.
    Based on the topic "${prompt}", generate 3 engaging, educational blocks.
    Each block must be:
    1. Directly related to the topic "${prompt}"
    2. Age-appropriate for ${age_group}
    3. Educational and factual
    4. Fun and engaging
    5. Safe and child-friendly

    Format your response as a JSON object with this exact structure:
    {
      "blocks": [
        {
          "title": "🌟 [Your title here]",
          "metadata": {
            "topic": "[specific subtopic]",
            "type": "fact",
            "prompt": "[detailed prompt for content generation]"
          }
        }
      ]
    }

    Each title must:
    - Start with an emoji
    - Be exactly 70 characters long
    - Be directly related to ${prompt}
    - Be educational and engaging
    - Be appropriate for children aged ${age_group}
    
    Only return the JSON object, no other text.
  `;

  try {
    const result = await model.generateContent(structuredPrompt);
    const text = result.response.text();
    console.log('Gemini response:', text);
    return text;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    // Return fallback content instead of throwing
    return JSON.stringify({
      blocks: [
        {
          title: "🌟 Discover Amazing Animal Facts: From Tiny Insects to Giant Whales in Our World!",
          metadata: {
            topic: "animals",
            type: "fact",
            prompt: "Tell me fascinating facts about different animals in our world"
          }
        },
        {
          title: "🔬 Explore the Magic of Science: Fun Experiments You Can Try at Home Today!",
          metadata: {
            topic: "science",
            type: "fact",
            prompt: "Share exciting science experiments that are safe and fun for children"
          }
        },
        {
          title: "🌍 Journey Around the World: Exploring Different Cultures and Amazing Places!",
          metadata: {
            topic: "geography",
            type: "fact",
            prompt: "Tell me about interesting places and cultures around the world"
          }
        }
      ]
    });
  }
};