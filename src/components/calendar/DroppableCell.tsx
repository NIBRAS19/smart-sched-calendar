import { useDrop } from 'react-dnd';
import { format, isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DraggableEvent from './DraggableEvent';
import { Holiday } from '@/hooks/useHolidays';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface DroppableCellProps {
  day: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  dayEvents: Event[];
  dayHolidays: Holiday[];
  onAddEvent?: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onMoveEvent: (event: Event, targetDate: Date) => void;
}

export default function DroppableCell({
  day,
  isToday,
  isCurrentMonth,
  dayEvents,
  dayHolidays,
  onAddEvent,
  onSelectDate,
  onEventClick,
  onMoveEvent,
}: DroppableCellProps) {
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item: { event: Event }) => {
      try {
        // Only move the event if the day is different
        if (!isSameDay(item.event.start, day)) {
          console.log('Dropping event on day:', format(day, 'yyyy-MM-dd'));
          onMoveEvent(item.event, day);
        } else {
          console.log('Dropping event on same day, no action needed');
        }
      } catch (error) {
        console.error('Error in drop handler:', error);
      }
    },
    canDrop: (item: { event: Event }) => {
      // Optional: Add logic here if you want to prevent dropping on certain days
      return true;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [day, onMoveEvent]);
  
  // Determine if we need to show event dots instead of full events (for mobile)
  const isMobile = window.innerWidth <= 768;
  const hasMoreEvents = dayEvents.length > (dayHolidays.length > 0 ? 1 : 2);
  
  // Add 'has-more' class when we have more events than we can display
  const cellClasses = `calendar-cell ${isToday ? 'calendar-today' : ''} ${
    !isCurrentMonth ? 'opacity-40' : ''
  } ${dayHolidays.length > 0 ? 'bg-destructive/5' : ''} ${
    isOver ? 'bg-muted/50' : 'hover:bg-muted/20'
  } ${hasMoreEvents && isMobile ? 'has-more' : ''} group transition-colors touch-target`;

  return (
    <div 
      ref={drop}
      className={cellClasses}
      onClick={() => onSelectDate(day)}
    >
      <div className="flex justify-between items-start relative">
        <div className="flex items-center">
          {isToday ? (
            <span className="calendar-day bg-primary text-primary-foreground size-6 md:size-7 flex items-center justify-center rounded-full day-number">
              {format(day, 'd')}
            </span>
          ) : (
            <span className="calendar-day size-6 md:size-7 flex items-center justify-center day-number">
              {format(day, 'd')}
            </span>
          )}
        </div>
        
        {/* Today indicator for mobile - small dot at corner */}
        {isToday && (
          <div className="current-day-indicator md:hidden">
            {format(day, 'd')}
          </div>
        )}
        
        <div className="flex items-center">
          {onAddEvent && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              onClick={(e) => {
                e.stopPropagation();
                onAddEvent(day);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-1.5">
        {/* For desktop and larger tablets */}
        <div className="hidden md:block">
          {dayHolidays.map(holiday => (
            <div 
              key={holiday.id}
              className="calendar-event text-xs"
              style={{ backgroundColor: holiday.color || "var(--event-holiday)" }}
            >
              🎉 {holiday.name}
            </div>
          ))}
          
          {dayEvents.slice(0, dayHolidays.length > 0 ? 2 : 3).map(event => (
            <DraggableEvent 
              key={event.id} 
              event={event} 
              onEventClick={onEventClick}
            />
          ))}
          
          {(dayEvents.length > (dayHolidays.length > 0 ? 2 : 3)) && (
            <div className="text-xs text-muted-foreground mt-1 font-medium">
              +{dayEvents.length - (dayHolidays.length > 0 ? 2 : 3)} more
            </div>
          )}
        </div>
        
        {/* For mobile - compact view */}
        <div className="block md:hidden">
          {/* Always show holiday */}
          {dayHolidays.length > 0 && (
            <div 
              className="calendar-event text-xs"
              style={{ backgroundColor: dayHolidays[0].color || "var(--event-holiday)" }}
              onClick={(e) => {
                e.stopPropagation();
                // Could show holiday details
              }}
            >
              🎉 {dayHolidays[0].name.length > 10 
                ? `${dayHolidays[0].name.substring(0, 10)}...` 
                : dayHolidays[0].name}
            </div>
          )}
          
          {/* Show first 1-2 events depending on available space */}
          {dayEvents.slice(0, dayHolidays.length > 0 ? 1 : 2).map(event => (
            <DraggableEvent 
              key={event.id} 
              event={event} 
              onEventClick={onEventClick}
              isMobile={true}
            />
          ))}
          
          {/* For mobile, show dots for remaining events */}
          {hasMoreEvents && (
            <div className="collapsed-events">
              {dayEvents.slice(dayHolidays.length > 0 ? 1 : 2, dayHolidays.length > 0 ? 4 : 5).map(event => (
                <span 
                  key={event.id} 
                  className="event-dot"
                  style={{ backgroundColor: 
                    event.type === "work" ? "var(--event-work)" : 
                    event.type === "personal" ? "var(--event-personal)" :
                    event.type === "meeting" ? "var(--event-meeting)" :
                    event.type === "reminder" ? "var(--event-reminder)" :
                    "var(--event-other)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                />
              ))}
              
              {dayEvents.length > (dayHolidays.length > 0 ? 4 : 5) && (
                <span className="text-xs">+{dayEvents.length - (dayHolidays.length > 0 ? 4 : 5)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
