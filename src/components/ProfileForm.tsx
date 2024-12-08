import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 4 && num <= 12;
  }, "Age must be between 4 and 12"),
  gender: z.enum(["boy", "girl", "other"]),
  language: z.string().min(2).max(10),
});

const languages = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "zh", label: "Chinese" },
  { value: "de", label: "German" },
];

export function ProfileForm({ onComplete }: { onComplete: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: "boy",
      language: "en",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          age: parseInt(values.age),
          gender: values.gender,
          language: values.language,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated!",
        description: "Let's start exploring together!",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to WonderWhiz!</h1>
        <p className="text-gray-500">Tell us a bit about yourself</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How old are you?</FormLabel>
                <FormControl>
                  <Input type="number" min="4" max="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="boy" id="boy" />
                      <label htmlFor="boy">Boy</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="girl" id="girl" />
                      <label htmlFor="girl">Girl</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="other">Other</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          
          <Button type="submit" className="w-full">
            Let's Start Learning!
          </Button>
        </form>
      </Form>
    </div>
  );
}