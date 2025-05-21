import React from "react";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft, ChevronRight, Search, Bell, UserCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CalendarHeaderProps {
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  viewType: string;
  onChangeView: (view: string) => void;
  onCreateEvent: () => void;
}

export default function CalendarHeader({
  dateLabel,
  onPrev,
  onNext,
  onToday,
  viewType,
  onChangeView,
  onCreateEvent,
}: CalendarHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 px-2 md:px-0 border-b bg-background sticky top-0 z-20">
      <div className="flex items-center gap-2 flex-1">
        <Button variant="ghost" size="icon" className="mr-2">
          <Home size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrev}>
          <ChevronLeft size={20} />
        </Button>
        <span className="text-xl font-bold mx-2 min-w-[120px] text-center">{dateLabel}</span>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight size={20} />
        </Button>
        <Button variant="outline" size="sm" className="ml-2" onClick={onToday}>
          Today
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-center md:justify-end">
        <Button
          variant={viewType === "month" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => onChangeView("month")}
        >
          Month
        </Button>
        <Button
          variant={viewType === "week" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => onChangeView("week")}
        >
          Week
        </Button>
        <Button
          variant={viewType === "day" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => onChangeView("day")}
        >
          Day
        </Button>
        <Button variant="default" size="sm" className="ml-2 flex items-center gap-1" onClick={onCreateEvent}>
          <Plus size={16} /> Event
        </Button>
        <Button variant="ghost" size="icon" className="ml-2">
          <Search size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Avatar className="h-8 w-8 border ml-2">
          <AvatarImage src="/images/profile.png" alt="User" />
          <AvatarFallback>
            <UserCircle size={20} />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
} 