import { useDrag } from 'react-dnd';
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface DraggableEventProps {
  event: Event;
  onEventClick: (event: Event) => void;
  isMobile?: boolean;
}

export default function DraggableEvent({ event, onEventClick, isMobile = false }: DraggableEventProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        // Event was dragged but not dropped on a valid target
        console.log('Event drag cancelled or dropped outside valid target');
      }
    },
  }), [event]);

  // For mobile, create a more compact view
  if (isMobile) {
    return (
      <div 
        ref={drag}
        className={`calendar-event cursor-grab ${isDragging ? 'opacity-50' : ''} touch-target`}
        style={{ backgroundColor: `var(--event-${event.type})` }}
        onClick={(e) => {
          e.stopPropagation();
          onEventClick(event);
        }}
      >
        <div className="flex items-center">
          <span className="truncate">{event.title.length > 12 ? `${event.title.substring(0, 12)}...` : event.title}</span>
        </div>
      </div>
    );
  }

  // Standard view for desktop
  return (
    <div 
      ref={drag}
      className={`calendar-event cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      style={{ backgroundColor: `var(--event-${event.type})` }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{event.title}</span>
        {event.start.getHours() !== 0 && (
          <span className="text-xs opacity-75 whitespace-nowrap ml-1">
            {format(event.start, "h:mm a")}
          </span>
        )}
      </div>
    </div>
  );
}
