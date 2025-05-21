import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users,
  Edit,
  Trash2
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface EventBottomSheetProps {
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: () => void;
}

const EventBottomSheet: React.FC<EventBottomSheetProps> = ({
  event,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!event) return null;

  const getEventColor = () => {
    switch (event.type) {
      case "work": return "var(--event-work)";
      case "personal": return "var(--event-personal)";
      case "meeting": return "var(--event-meeting)";
      case "reminder": return "var(--event-reminder)";
      default: return "var(--event-other)";
    }
  };

  const getEventTypeName = () => {
    switch (event.type) {
      case "work": return "Work";
      case "personal": return "Personal";
      case "meeting": return "Meeting";
      case "reminder": return "Reminder";
      default: return "Other";
    }
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className="relative w-full bg-background rounded-t-xl shadow-lg animate-in slide-in-from-bottom z-50"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Handle for dragging */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-muted" />
        </div>
        
        {/* Close button */}
        <div className="absolute right-4 top-3">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <ChevronDown size={18} />
          </Button>
        </div>
        
        {/* Header with type color */}
        <div 
          className="p-5"
          style={{ backgroundColor: `${getEventColor()}15` }}
        >
          <div className="space-y-3">
            <Badge 
              className="px-2 py-0.5 text-xs"
              style={{ 
                backgroundColor: getEventColor(),
                color: 'white'
              }}
            >
              {getEventTypeName()}
            </Badge>
            <h2 className="text-xl font-semibold">{event.title}</h2>
          </div>
        </div>
        
        {/* Event details */}
        <div className="p-5 space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {/* Date and time */}
          <div className="flex items-start space-x-3">
            <div className="text-primary mt-0.5">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h4 className="font-medium">Date & Time</h4>
              <p className="text-sm text-muted-foreground">
                {format(event.start, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
              </p>
            </div>
          </div>
          
          {/* Description, if available */}
          {event.description && (
            <div className="flex items-start space-x-3">
              <div className="invisible">
                <CalendarIcon size={18} />
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="p-4 border-t flex space-x-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handleEdit}
          >
            <Edit size={16} className="mr-2" /> Edit
          </Button>
          <Button 
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventBottomSheet;
