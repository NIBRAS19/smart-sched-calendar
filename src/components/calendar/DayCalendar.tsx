import { useMemo, useEffect, useState, useRef } from "react";
import { format, parseISO, isSameDay, addHours, startOfDay, endOfDay, isToday } from "date-fns";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { Badge } from "@/components/ui/badge";
import { Holiday } from "@/hooks/useHolidays";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface DayCalendarProps {
  currentDate: Date;
  events: Event[];
  holidays?: Holiday[];
  onEventClick: (event: Event) => void;
  onSlotClick?: (date: Date) => void;
}

interface DraggableTimeEventProps {
  event: Event;
  onEventClick: (event: Event) => void;
  style?: React.CSSProperties;
}

// Add helper function to calculate event position and height
const calculateEventPosition = (event: Event, timeSlot: Date) => {
  const slotHour = timeSlot.getHours();
  const eventStartHour = event.start.getHours();
  const eventStartMinutes = event.start.getMinutes();
  const eventEndHour = event.end.getHours();
  const eventEndMinutes = event.end.getMinutes();
  
  // Calculate position as percentage of hour
  const startPosition = (eventStartMinutes / 60) * 100;
  
  // Calculate height based on duration
  const durationMinutes = (eventEndHour - eventStartHour) * 60 + (eventEndMinutes - eventStartMinutes);
  const heightPercentage = (durationMinutes / 60) * 100;
  
  // If event spans multiple hours, adjust height
  const isMultiHour = eventEndHour > eventStartHour;
  const adjustedHeight = isMultiHour ? Math.min(heightPercentage, 100) : heightPercentage;
  
  return {
    top: `${startPosition}%`,
    height: `${adjustedHeight}%`,
    isVisible: eventStartHour === slotHour || (isMultiHour && slotHour > eventStartHour && slotHour <= eventEndHour)
  };
};

// Add helper function to handle overlapping events
const handleOverlappingEvents = (events: Event[]) => {
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const columns: Event[][] = [[]];
  const eventColumns = new Map<string, number>();
  
  sortedEvents.forEach(event => {
    let placed = false;
    let columnIndex = 0;
    
    // Try to place event in existing columns
    while (columnIndex < columns.length) {
      const column = columns[columnIndex];
      const lastEvent = column[column.length - 1];
      
      if (!lastEvent || lastEvent.end <= event.start) {
        column.push(event);
        eventColumns.set(event.id, columnIndex);
        placed = true;
        break;
      }
      
      columnIndex++;
    }
    
    // If couldn't place in existing columns, create new column
    if (!placed) {
      columns.push([event]);
      eventColumns.set(event.id, columns.length - 1);
    }
  });
  
  return { columns, eventColumns };
};

const DraggableTimeEvent: React.FC<DraggableTimeEventProps> = ({ event, onEventClick, style }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DAY_EVENT',
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [event]);
  
  const eventColor = `var(--event-${event.type})`;
  const isMultiHour = event.end.getHours() > event.start.getHours();
  
  return (
    <div 
      ref={drag}
      className={`calendar-event cursor-grab shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isMultiHour ? 'border-l-4' : ''}`}
      style={{ 
        ...style,
        backgroundColor: eventColor,
        borderLeftColor: isMultiHour ? eventColor : undefined,
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : undefined
      }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <span className="font-medium truncate text-sm">
            {event.title}
          </span>
          <span className="text-xs opacity-90 whitespace-nowrap ml-1">
            {format(event.start, "h:mm a")}
          </span>
        </div>
        
        {event.description && (
          <div className="text-xs opacity-90 truncate mt-1 flex-1">
            {event.description}
          </div>
        )}
        
        {isMultiHour && (
          <div className="text-xs opacity-90 mt-1">
            Ends {format(event.end, "h:mm a")}
          </div>
        )}
      </div>
    </div>
  );
};

// Component for droppable time slot
const DroppableTimeSlot = ({ timeSlot, isCurrentHour, children, onSlotClick }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'DAY_EVENT',
    drop: (item: { event: Event }) => {
      try {
        console.log('Dropping event on time slot:', format(timeSlot, 'h:mm a'));
        // Here you would implement the logic to move the event to this time slot
        // This would require a handler function passed from the parent component
      } catch (error) {
        console.error('Error in drop handler:', error);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [timeSlot, onSlotClick]);
  
  return (
    <div 
      ref={drop}
      className={`time-content flex-1 min-h-16 py-2 pl-2 md:pl-4 border-l relative cursor-pointer ${isOver ? 'bg-muted/30' : ''}`}
      onClick={() => onSlotClick && onSlotClick(timeSlot)}
    >
      {children}
    </div>
  );
};

export default function DayCalendar({ 
  currentDate, 
  events,
  holidays = [],
  onEventClick,
  onSlotClick,
}: DayCalendarProps) {
  // Current time indicator
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeIndicatorRef = useRef<HTMLDivElement>(null);
  
  // Update current time every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };
    
    // Initial update
    updateCurrentTime();
    
    // Set interval to update every minute
    const intervalId = setInterval(updateCurrentTime, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to current time on initial render if today
  useEffect(() => {
    if (isToday(currentDate) && timeIndicatorRef.current) {
      setTimeout(() => {
        timeIndicatorRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [currentDate]);
  // Generate hourly time slots from 7 AM to 10 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 7; i <= 22; i++) {
      slots.push(addHours(startOfDay(currentDate), i));
    }
    return slots;
  }, [currentDate]);
  
  // Filter events for the current day and sort by start time
  const dayEvents = useMemo(() => {
    return events
      .filter(event => isSameDay(event.start, currentDate))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, currentDate]);
  
  // Separate all-day events (start at 0:00, end at 23:59 or longer)
  const allDayEvents = useMemo(() => {
    return dayEvents.filter(event =>
      event.start.getHours() === 0 && event.start.getMinutes() === 0 &&
      (event.end.getHours() === 23 && event.end.getMinutes() === 59 || event.end.getDate() > event.start.getDate())
    );
  }, [dayEvents]);
  const timedEvents = useMemo(() => {
    return dayEvents.filter(event => !allDayEvents.includes(event));
  }, [dayEvents, allDayEvents]);
  
  // Group events by hour and handle overlaps
  const eventsByHour = useMemo(() => {
    const grouped: Record<number, { columns: Event[][], eventColumns: Map<string, number> }> = {};
    
    timedEvents.forEach(event => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();
      
      // Handle events that span multiple hours
      for (let currentHour = startHour; currentHour <= endHour; currentHour++) {
        if (!grouped[currentHour]) {
          grouped[currentHour] = { columns: [], eventColumns: new Map() };
        }
        
        // Get all events that overlap with this hour
        const overlappingEvents = timedEvents.filter(e => 
          (e.start.getHours() <= currentHour && e.end.getHours() >= currentHour) ||
          (e.start.getHours() === currentHour)
        );
        
        // Handle overlapping events for this hour
        const { columns, eventColumns } = handleOverlappingEvents(overlappingEvents);
        grouped[currentHour] = { columns, eventColumns };
      }
    });
    
    return grouped;
  }, [timedEvents]);
  
  // Filter holidays for the current day
  const dayHolidays = useMemo(() => {
    return holidays.filter(holiday => 
      isSameDay(holiday.date, currentDate)
    );
  }, [holidays, currentDate]);
  
  // Calculate current time indicator position
  const calculateTimeIndicatorPosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Convert to percentage of the hour (0-100)
    const percentage = (minutes / 60) * 100;
    return percentage;
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="day-calendar border rounded-xl bg-card">
        <div className={`day-header p-4 text-center border-b ${
          dayHolidays.length > 0 ? 'bg-destructive/5' : 'bg-muted/10'
        }`}>
          <h2 className="text-xl font-medium">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </h2>
          
          {dayHolidays.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {dayHolidays.map(holiday => (
                <div 
                  key={holiday.id}
                  className="calendar-holiday inline-flex mx-auto"
                  style={{ backgroundColor: holiday.color || "var(--destructive)" }}
                >
                  🎉 {holiday.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* All Day Events Section */}
        {allDayEvents.length > 0 && (
          <div className="all-day-events p-2 border-b bg-muted/10 flex gap-2">
            <span className="font-semibold text-xs text-muted-foreground">All Day:</span>
            {allDayEvents.map(event => (
              <div key={event.id} className="calendar-event px-2 py-1 rounded bg-primary text-primary-foreground text-xs cursor-pointer" onClick={() => onEventClick(event)}>
                {event.title}
              </div>
            ))}
          </div>
        )}
        <div className="day-body p-2 md:p-4 relative">
          {timeSlots.map((timeSlot, index) => {
            const hour = timeSlot.getHours();
            const hourData = eventsByHour[hour] || { columns: [], eventColumns: new Map() };
            const isCurrentHour = isToday(currentDate) && hour === currentTime.getHours();
            
            return (
              <div 
                key={index} 
                className={`time-slot flex hover:bg-muted/10 group transition-colors ${
                  isCurrentHour ? 'relative' : ''
                }`}
                ref={isCurrentHour ? timeIndicatorRef : null}
              >
                <div className="time-label w-16 md:w-20 py-4 text-right pr-2 md:pr-4 text-muted-foreground font-medium text-xs md:text-sm">
                  {format(timeSlot, "h:mm a")}
                </div>
                
                <DroppableTimeSlot
                  timeSlot={timeSlot}
                  isCurrentHour={isCurrentHour}
                  onSlotClick={onSlotClick}
                >
                  {/* Current time indicator */}
                  {isToday(currentDate) && hour === currentTime.getHours() && (
                    <div 
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{
                        top: `${calculateTimeIndicatorPosition()}%`,
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
                        <div className="h-[2px] bg-destructive flex-1"></div>
                        <div className="text-xs text-destructive whitespace-nowrap pr-1">
                          {format(currentTime, "h:mm a")}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="event-container relative flex-1 min-h-[60px]">
                    {hourData.columns.length > 0 ? (
                      hourData.columns.map((column, columnIndex) => (
                        <div 
                          key={columnIndex}
                          className="event-column"
                          style={{
                            width: `${100 / hourData.columns.length}%`,
                            left: `${(columnIndex * 100) / hourData.columns.length}%`,
                            position: 'absolute',
                            height: '100%',
                            padding: '0 2px'
                          }}
                        >
                          {column.map(event => {
                            const { top, height, isVisible } = calculateEventPosition(event, timeSlot);
                            if (!isVisible) return null;
                            
                            return (
                              <DraggableTimeEvent 
                                key={event.id}
                                event={event}
                                onEventClick={onEventClick}
                                style={{
                                  position: 'absolute',
                                  top,
                                  height,
                                  width: '95%',
                                  margin: '0 auto',
                                  left: 0,
                                  right: 0,
                                  zIndex: hourData.eventColumns.get(event.id) || 0
                                }}
                              />
                            );
                          }).filter(Boolean)}
                        </div>
                      ))
                    ) : (
                      <div className="empty-slot h-full w-full group-hover:bg-muted/5 rounded-lg transition-colors" />
                    )}
                  </div>
                </DroppableTimeSlot>
              </div>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}
