import { Block } from "@/types/chat";

export const generateInitialBlocks = async (age: number): Promise<Block[]> => {
  const { data, error } = await supabase.functions.invoke('generate-blocks', {
    body: {
      query: `Generate engaging educational topics for a ${age} year old`,
      context: "general education",
      age_group: `${age}-${age + 2}`
    }
  });

  if (error) {
    console.error('Error generating blocks:', error);
    return [];
  }

  const parsedData = typeof data.choices[0].message.content === 'string' 
    ? JSON.parse(data.choices[0].message.content) 
    : data.choices[0].message.content;

  return parsedData.blocks || [];
};