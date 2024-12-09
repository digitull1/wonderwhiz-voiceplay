import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
];

const topics = [
  { id: "space", name: "Space & Astronomy", emoji: "🌌" },
  { id: "animals", name: "Animals & Nature", emoji: "🦁" },
  { id: "science", name: "Science & Experiments", emoji: "🔬" },
  { id: "history", name: "History & Culture", emoji: "🏺" },
  { id: "math", name: "Math & Puzzles", emoji: "🔢" },
  { id: "art", name: "Art & Creativity", emoji: "🎨" },
];

export const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Could not load profile settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          age: parseInt(formData.age),
          language: formData.language,
          topics_of_interest: formData.topics
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated",
        className: "bg-primary text-white"
      });

      loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Could not save profile settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-gray-500">Customize your learning experience</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile?.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="4"
            max="12"
            value={profile?.age || ""}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            placeholder="Your age"
          />
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={profile?.language || "en"}
            onValueChange={(value) => setProfile({ ...profile, language: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Topics of Interest</Label>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                type="button"
                variant={profile?.topics_of_interest?.includes(topic.id) ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  const newTopics = profile?.topics_of_interest?.includes(topic.id)
                    ? profile.topics_of_interest.filter((t: string) => t !== topic.id)
                    : [...(profile?.topics_of_interest || []), topic.id];
                  setProfile({ ...profile, topics_of_interest: newTopics });
                }}
              >
                <span className="mr-2">{topic.emoji}</span>
                {topic.name}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => handleSave(profile)}
          disabled={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};