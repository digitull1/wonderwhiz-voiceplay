import React from "react";
import { Menu, LogOut, LogIn, UserPlus } from "lucide-react";
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
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onLogout}
              className="text-primary"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPanelToggle}
              className="text-primary"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost"
              onClick={() => onAuthClick(false)}
              className="text-primary flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Sign Up
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onAuthClick(true)}
              className="text-primary flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Log In
            </Button>
          </>
        )}
      </div>
    </div>
  );
};