import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageStepProps {
  form: UseFormReturn<any>;
  onComplete: () => void;
  onBack: () => void;
}

const languages = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "zh", label: "Chinese" },
  { value: "de", label: "German" },
];

export function LanguageStep({ form, onComplete, onBack }: LanguageStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={form.handleSubmit(onComplete)} className="flex-1">
          Complete Registration
        </Button>
      </div>
    </motion.div>
  );
}