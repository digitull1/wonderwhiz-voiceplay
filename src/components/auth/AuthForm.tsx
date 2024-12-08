import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  onComplete?: () => void;
}

export const AuthForm = ({ onComplete }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try to sign up first
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: parseInt(formData.age),
          },
        },
      });

      if (signUpError) {
        // If user already exists, try to sign in instead
        if (signUpError.message === "User already registered") {
          console.log('User exists, trying sign in instead');
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (signInError) {
            console.error('Sign in error:', signInError);
            toast({
              title: "Error signing in",
              description: signInError.message,
              variant: "destructive",
            });
            throw signInError;
          }
          
          toast({
            title: "Welcome back! 👋",
            description: "Successfully signed in to your account.",
          });
          onComplete?.();
          return;
        }
        
        // Handle other signup errors
        console.error('Sign up error:', signUpError);
        toast({
          title: "Error creating account",
          description: signUpError.message,
          variant: "destructive",
        });
        throw signUpError;
      }

      toast({
        title: "Welcome to WonderWhiz! 🌟",
        description: "Your account has been created successfully.",
      });
      onComplete?.();
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Your name"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="your.email@example.com"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          placeholder="Choose a password"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="4"
          max="12"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
          placeholder="Your age"
          className="mt-1"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait..." : "Start Learning!"}
      </Button>
    </form>
  );
};