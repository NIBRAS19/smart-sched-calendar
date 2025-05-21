import { Button } from "@/components/ui/button";
import {
  Home,
  UserCircle,
  Save,
  Settings as SettingsIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDialog } from "./SearchDialog";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface SettingsHeaderProps {
  title: string;
  subtitle?: string;
  onSaveSettings: (e?: React.FormEvent) => void;
}

export default function SettingsHeader({
  title,
  subtitle,
  onSaveSettings,
}: SettingsHeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-md sticky top-0 z-20 border-b py-4 px-4 md:px-6 transition-all hidden md:block">
      <div className="flex items-center justify-between gap-3">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="mr-2 ml-5">
            <Button variant="ghost" size="icon" aria-label="Home">
              <Home size={20} />
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

        {/* Middle section - intentionally empty */}
        <div className="flex-1"></div>

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
