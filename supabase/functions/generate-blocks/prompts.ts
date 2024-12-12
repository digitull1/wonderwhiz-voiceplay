export const generateAgeSpecificInstructions = (ageGroup: string) => {
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

export const buildPrompt = (query: string, context: string, ageInstructions: string) => {
  return `
    Based on "${query}" and topic "${context}", generate EXACTLY 3 engaging, educational blocks.
    ${ageInstructions}
    
    Format as a valid JSON object with a 'blocks' array containing objects with 'title' and 'metadata'.
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
    
    Ensure the response is ONLY the JSON object, no additional text.
  `;
}