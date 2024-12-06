import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlocksNavigationProps {
  onScroll: (direction: 'left' | 'right') => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export const BlocksNavigation = ({ 
  onScroll, 
  canScrollLeft, 
  canScrollRight 
}: BlocksNavigationProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 
          hover:bg-white/90 transition-all duration-300"
        onClick={() => onScroll('left')}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 
          hover:bg-white/90 transition-all duration-300"
        onClick={() => onScroll('right')}
        disabled={!canScrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};