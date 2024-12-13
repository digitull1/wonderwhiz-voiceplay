import * as z from "zod";

export const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 4 && num <= 12;
  }, "Age must be between 4 and 12"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;