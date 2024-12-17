import { toast } from "@/components/ui/use-toast";

export const handleError = (message: string) => {
  window.dispatchEvent(new CustomEvent('wonderwhiz:newMessage', {
    detail: {
      text: "Oops! " + message + ". Let's try something else! ✨",
      isAi: true
    }
  }));

  toast({
    title: "Oops!",
    description: message,
    variant: "destructive"
  });
};