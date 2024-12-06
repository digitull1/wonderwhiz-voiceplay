import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageAnalysis = async (response: string) => {
    try {
      setIsAnalyzing(true);
      console.log("Analyzing image response:", response);
      
      // Add the AI's image analysis as a message
      return response;
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again!",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    handleImageAnalysis,
    isAnalyzing
  };
};