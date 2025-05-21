import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick 
}) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 md:hidden bg-primary hover:bg-primary/90 transition-all duration-200 ease-in-out"
      size="icon"
      aria-label="Add Event"
    >
      <Plus size={24} className="text-primary-foreground" />
      <span className="sr-only">Add Event</span>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full animate-ping-slow bg-primary opacity-20"></span>
    </Button>
  );
};

export default FloatingActionButton;
