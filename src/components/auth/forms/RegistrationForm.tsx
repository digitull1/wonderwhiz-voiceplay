import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TopicSelection } from "./TopicSelection";
import { LanguageSelection } from "./LanguageSelection";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { Loader2 } from "lucide-react";

export const RegistrationForm = ({ onComplete }: { onComplete?: () => void }) => {
  const {
    formData,
    setFormData,
    selectedTopics,
    handleTopicToggle,
    isLoading,
    handleSubmit,
  } = useRegistrationForm(onComplete);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Child's Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
            disabled={isLoading}
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
            placeholder="Your age (4-12)"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">Parent's Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="parent@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Choose a secure password"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <TopicSelection
          selectedTopics={selectedTopics}
          onTopicToggle={handleTopicToggle}
          disabled={isLoading}
        />

        <LanguageSelection
          value={formData.language}
          onChange={(value) => setFormData({ ...formData, language: value })}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating your magical account...
          </>
        ) : (
          "Start Your Adventure! 🚀"
        )}
      </Button>
    </form>
  );
};