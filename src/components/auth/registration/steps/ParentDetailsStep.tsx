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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ParentDetailsStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function ParentDetailsStep({ form, onNext }: ParentDetailsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="parentEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent's Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="parent@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Choose a secure password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button 
        type="button" 
        className="w-full" 
        onClick={onNext}
      >
        Next
      </Button>
    </motion.div>
  );
}