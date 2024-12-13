import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "./hooks/useAuthForm";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  onComplete?: () => void;
  isLogin?: boolean;
}

export const AuthForm = ({ onComplete, isLogin = false }: AuthFormProps) => {
  const {
    isLoading,
    setIsLoading,
    formData,
    setFormData,
    handleLogin,
    handleRegister,
  } = useAuthForm(onComplete);
  
  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.email?.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.password?.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive",
      });
      return false;
    }
    if (!isLogin && !formData.name?.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your child's name",
        variant: "destructive",
      });
      return false;
    }
    if (!isLogin && !formData.age?.trim()) {
      toast({
        title: "Age Required",
        description: "Please enter your child's age",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? "Welcome Back! ✨" : "Join WonderWhiz! 🌟"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? "Continue your magical learning journey" 
                : "Let's create your magical learning account"}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Child's Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                    placeholder="Your name"
                    className="mt-1"
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
                    required={!isLogin}
                    placeholder="Your age (4-12)"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Parent's Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="parent@example.com"
                className="mt-1"
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
                required
                placeholder="Choose a secure password"
                className="mt-1"
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Signing in..." : "Creating your magical account..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Start Your Adventure!"
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};