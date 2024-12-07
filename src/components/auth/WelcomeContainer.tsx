import { motion } from "framer-motion";
import { AuthForm } from "./AuthForm";

export const WelcomeContainer = () => {
  return (
    <motion.div 
      className="min-h-screen gradient-bg flex flex-col items-center justify-center relative overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to WonderWhiz! 🌟</h1>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <AuthForm />
        </div>
      </div>
    </motion.div>
  );
};