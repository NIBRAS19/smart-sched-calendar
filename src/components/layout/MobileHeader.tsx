import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  onCreateEvent?: () => void;
  viewType: string;
  onChangeView: (view: string) => void;
}

export default function MobileHeader({
  title,
  onPrevious,
  onNext,
  onToday,
  onCreateEvent,
  viewType,
  onChangeView,
}: MobileHeaderProps) {
  return (
    <div className="flex flex-col gap-2 pb-1 pt-1 px-2 md:hidden sticky top-16 z-20 bg-background border-b">
      {/* Title with current date - using small font to save space */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarIcon size={14} className="text-primary" />
          <h1 className="text-base font-medium truncate max-w-[200px]">{title}</h1>
        </div>
      </div>
      
      {/* Navigation controls and view switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrevious} 
            aria-label="Previous"
            className="rounded-full h-7 w-7"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToday} 
            className="whitespace-nowrap rounded-full px-2 text-xs h-7"
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext} 
            aria-label="Next"
            className="rounded-full h-7 w-7"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
        
        <div className="flex items-center rounded-full border overflow-hidden shadow-sm h-7">
          <Button 
            variant="ghost" 
            size="sm"
            className={`rounded-none px-2 text-xs h-7 ${viewType === 'month' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => onChangeView('month')}
          >
            M
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`rounded-none px-2 text-xs h-7 ${viewType === 'week' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => onChangeView('week')}
          >
            W
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`rounded-none px-2 text-xs h-7 ${viewType === 'day' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => onChangeView('day')}
          >
            D
          </Button>
        </div>
      </div>
    </div>
  );
}
