import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("groqApiKey");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim().startsWith("gsk_")) {
      localStorage.setItem("groqApiKey", apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved securely.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Groq API key starting with 'gsk_'.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto mb-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Groq API Configuration</h3>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Groq API key"
        className="font-mono"
      />
      <Button onClick={handleSaveKey}>Save API Key</Button>
    </div>
  );
};