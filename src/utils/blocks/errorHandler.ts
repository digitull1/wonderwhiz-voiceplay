import { toast } from "@/hooks/use-toast";

export const handleError = (message: string) => {
  console.error('Error:', message);
  
  // Show user-friendly error message
  toast({
    title: "Oops!",
    description: message,
    variant: "destructive"
  });

  // Dispatch event for error state
  window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
    detail: {
      text: "I encountered a small hiccup! Let's try something else! ✨",
      isAi: true
    }
  }));
};