export const parseGroqResponse = (content: string) => {
  console.log('Raw content from Groq:', content);
  
  // Clean the content
  const cleanContent = content
    .replace(/```json\s*|\s*```/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\\n/g, ' ')
    .trim();
  
  console.log('Cleaned content:', cleanContent);

  try {
    // First attempt: direct parsing
    return JSON.parse(cleanContent);
  } catch (firstError) {
    console.log('Direct parsing failed:', firstError);
    console.log('Attempting to extract JSON');
    
    // Second attempt: try to find JSON object in the string
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const extractedJson = jsonMatch[0].trim();
    console.log('Extracted JSON:', extractedJson);
    
    try {
      return JSON.parse(extractedJson);
    } catch (secondError) {
      console.error('Failed to parse extracted JSON:', secondError);
      throw new Error(`Invalid JSON structure: ${secondError.message}`);
    }
  }
}

export const validateBlocksStructure = (data: any) => {
  if (!data?.blocks || !Array.isArray(data.blocks)) {
    throw new Error('Invalid blocks format in response');
  }
  
  // Validate each block
  data.blocks.forEach((block: any, index: number) => {
    if (!block.title || !block.metadata || !block.metadata.topic) {
      throw new Error(`Invalid block structure at index ${index}`);
    }
  });
  
  return data;
}