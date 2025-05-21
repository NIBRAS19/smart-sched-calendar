import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Home,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDialog } from "./SearchDialog";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  onCreateEvent?: () => void;
  viewType: string;
  onChangeView: (view: string) => void;
}

export default function Header({
  title,
  subtitle,
  onPrevious,
  onNext,
  onToday,
  onCreateEvent,
  viewType,
  onChangeView,
}: HeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-md sticky top-0 z-20 border-b py-4 px-4 md:px-6 transition-all hidden md:block">
      <div className="flex items-center justify-between gap-3">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="mr-2 ml-5">
            <Button variant="ghost" size="icon" aria-label="Home">
              <Home size={50} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold truncate flex items-center gap-2">
              {title}
              {subtitle && (
                <span className="text-sm text-muted-foreground">
                  / {subtitle}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
              aria-label="Previous"
              className="rounded-full h-9 w-9"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className="whitespace-nowrap rounded-full px-4"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              aria-label="Next"
              className="rounded-full h-9 w-9"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* View Type Switch */}
          <div className="flex items-center rounded-full border overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 ${
                viewType === "month"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => onChangeView("month")}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 ${
                viewType === "week"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => onChangeView("week")}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 ${
                viewType === "day" ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => onChangeView("day")}
            >
              Day
            </Button>
          </div>

          {/* Create Event Button */}
          <Button onClick={onCreateEvent} className="rounded-full">
            <Plus size={18} className="mr-1" />
            Event
          </Button>
        </div>

        {/* Right Section - Utilities */}
        <div className="flex items-center gap-3">
          <SearchDialog />
          <NotificationsDropdown />
          <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarImage
              src="/images/profile.png"
              alt="User"
            />
            <AvatarFallback>
              <UserCircle size={20} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
