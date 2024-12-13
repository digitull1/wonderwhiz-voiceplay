import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registrationSchema, type RegistrationFormData } from "./validation";
import { useRegistrationForm } from "./useRegistrationForm";
import { motion } from "framer-motion";

export const RegistrationForm = () => {
  const { isLoading, handleRegistration } = useRegistrationForm();
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      age: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    const success = await handleRegistration(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Join WonderWhiz! 🌟</h2>
        <p className="text-gray-600">Create your magical learning account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent's Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="parent@example.com"
                    {...field}
                    disabled={isLoading}
                  />
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
                  <Input
                    type="password"
                    placeholder="Choose a secure password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="4"
                    max="12"
                    placeholder="Your age (4-12)"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Creating your account..." : "Start Your Adventure! 🚀"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};