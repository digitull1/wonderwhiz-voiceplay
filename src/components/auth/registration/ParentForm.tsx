import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ParentFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

export const ParentForm: React.FC<ParentFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onNext,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>
      
      <div className="space-y-2">
        <Label htmlFor="email">Parent's Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="parent@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Choose a secure password"
          required
          disabled={isLoading}
        />
      </div>

      <Button 
        type="button" 
        className="w-full"
        onClick={onNext}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
};