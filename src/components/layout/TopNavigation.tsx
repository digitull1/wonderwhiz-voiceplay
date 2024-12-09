import React from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  isAuthenticated: boolean;
  onPanelToggle: () => void;
  onLogout: () => void;
  onAuthClick: (showLogin: boolean) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  isAuthenticated,
  onPanelToggle,
  onLogout,
  onAuthClick
}) => {
  return (
    <div className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        WonderWhiz
      </h1>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="text-primary hover:bg-primary/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPanelToggle}
            className="text-primary hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => onAuthClick(true)}
            className="bg-white hover:bg-gray-50"
          >
            Log In
          </Button>
          <Button 
            onClick={() => onAuthClick(false)}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};