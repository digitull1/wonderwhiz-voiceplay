export const parseGroqResponse = (content: string) => {
  console.log('Raw content from Groq:', content);
  
  // Clean the content - remove code blocks, invisible characters, and extra whitespace
  const cleanContent = content
    .replace(/```json\s*|\s*```/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\\n/g, ' ')
    .replace(/,\s*}/g, '}') // Fix trailing commas
    .replace(/,\s*]/g, ']') // Fix trailing commas in arrays
    .trim();
  
  console.log('Cleaned content:', cleanContent);

  try {
    // First attempt: direct parsing
    return JSON.parse(cleanContent);
  } catch (firstError) {
    console.log('Direct parsing failed:', firstError);
    
    try {
      // Second attempt: try to extract JSON object
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const extractedJson = jsonMatch[0]
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)([^"'\s][^:]*?):/g, '$1"$2":') // Quote unquoted keys
        .trim();
      
      console.log('Extracted and cleaned JSON:', extractedJson);
      return JSON.parse(extractedJson);
    } catch (secondError) {
      console.error('Failed to parse extracted JSON:', secondError);
      
      // Third attempt: try to construct a valid blocks structure
      try {
        const fallbackBlocks = {
          blocks: [{
            title: "Interesting fact!",
            metadata: {
              topic: "general",
              type: "fact"
            }
          }]
        };
        console.log('Using fallback blocks structure');
        return fallbackBlocks;
      } catch (e) {
        throw new Error(`Invalid JSON structure: ${secondError.message}`);
      }
    }
  }
};

export const validateBlocksStructure = (data: any) => {
  if (!data?.blocks || !Array.isArray(data.blocks)) {
    console.error('Invalid blocks format, using fallback structure');
    return {
      blocks: [{
        title: "Interesting fact!",
        metadata: {
          topic: "general",
          type: "fact"
        }
      }]
    };
  }
  
  // Validate and fix each block
  const validatedBlocks = data.blocks.map((block: any, index: number) => {
    if (!block.title || !block.metadata || !block.metadata.topic) {
      console.log(`Fixing invalid block at index ${index}`);
      return {
        title: block.title || "Interesting fact!",
        metadata: {
          topic: block.metadata?.topic || "general",
          type: block.metadata?.type || "fact"
        }
      };
    }
    return block;
  });
  
  return { blocks: validatedBlocks };
};