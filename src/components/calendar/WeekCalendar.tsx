import { useMemo, useEffect, useState, useRef } from "react";
import { 
  format, 
  addDays, 
  startOfWeek, 
  isSameDay, 
  addHours, 
  startOfDay,
  isSameWeek,
  isToday
} from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Holiday } from "@/hooks/useHolidays";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface WeekCalendarProps {
  currentDate: Date;
  events: Event[];
  holidays?: Holiday[];
  onSelectDate: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onAddEvent?: (date: Date) => void;
}

export default function WeekCalendar({ 
  currentDate, 
  events,
  holidays = [],
  onSelectDate,
  onEventClick,
  onAddEvent,
}: WeekCalendarProps) {
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
  
  // Scroll to current time on initial render if today is in view
  useEffect(() => {
    if (weekDays.some(day => isToday(day)) && timeIndicatorRef.current) {
      setTimeout(() => {
        timeIndicatorRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, []);
  // Get the days of the week
  const weekDays = useMemo(() => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
  }, [currentDate]);
  
  // Generate hourly time slots from 7 AM to 10 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 7; i <= 22; i++) {
      slots.push(i);
    }
    return slots;
  }, []);
  
  // Filter events for the current week
  const weekEvents = useMemo(() => {
    return events.filter(event => 
      isSameWeek(event.start, currentDate, { weekStartsOn: 0 })
    );
  }, [events, currentDate]);
  
  // Group holidays by date for the current week
  const holidaysByDate = useMemo(() => {
    const grouped: Record<string, Holiday[]> = {};
    
    holidays.forEach(holiday => {
      if (isSameWeek(holiday.date, currentDate, { weekStartsOn: 0 })) {
        const dateStr = format(holiday.date, 'yyyy-MM-dd');
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(holiday);
      }
    });
    
    return grouped;
  }, [holidays, currentDate]);
  
  // Check if a date is today
  const isTodayCheck = (date: Date) => isSameDay(date, new Date());
  
  // Position events in the grid
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return weekEvents.filter(event => {
      return isSameDay(event.start, day) && event.start.getHours() === hour;
    });
  };
  
  // Calculate current time indicator position
  const calculateTimeIndicatorPosition = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    
    // Convert to percentage of the hour (0-100)
    const percentage = (minutes / 60) * 100;
    return percentage;
  };
  
  // Get holidays for a specific day
  const getHolidaysForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return holidaysByDate[dateStr] || [];
  };
  
  // Add all-day events logic
  const allDayEventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {};
    weekDays.forEach(day => {
      map[format(day, 'yyyy-MM-dd')] = weekEvents.filter(event =>
        isSameDay(event.start, day) &&
        event.start.getHours() === 0 && event.start.getMinutes() === 0 &&
        (event.end.getHours() === 23 && event.end.getMinutes() === 59 || event.end.getDate() > event.start.getDate())
      );
    });
    return map;
  }, [weekDays, weekEvents]);
  
  return (
    <div className="week-calendar border rounded-md bg-card overflow-auto">
      <div className="week-header grid grid-cols-8 border-b sticky top-0 bg-card z-10">
        <div className="col-span-1 p-4 border-r text-muted-foreground font-medium">
          Time
        </div>
        
        {weekDays.map((day, i) => {
          const dayHolidays = getHolidaysForDay(day);
          const hasHoliday = dayHolidays.length > 0;
          
          return (
            <div 
              key={i} 
              className={`col-span-1 p-2 text-center cursor-pointer hover:bg-muted/10 transition-colors ${
                isToday(day) ? "bg-primary/5" : ""
              } ${hasHoliday ? "bg-destructive/5" : ""}`}
              onClick={() => onSelectDate(day)}
            >
              <div className="font-medium">{format(day, "EEE")}</div>
              <div className={`text-lg ${isTodayCheck(day) ? "text-primary font-bold" : ""}`}>
                {format(day, "d")}
              </div>
              <div className="flex flex-col justify-center items-center gap-1">
                {isTodayCheck(day) && (
                  <Badge variant="outline" className="text-primary border-primary text-[10px]">
                    Today
                  </Badge>
                )}
                {hasHoliday && (
                  <Badge variant="outline" className="text-destructive border-destructive text-[10px]">
                    Holiday
                  </Badge>
                )}
                {onAddEvent && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 py-0 px-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newEventDate = new Date(day);
                      newEventDate.setHours(9, 0, 0); // Default to 9am
                      onAddEvent(newEventDate);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="week-body">
        {/* Display holidays at the top of the calendar */}
        <div className="week-row grid grid-cols-8 border-b bg-muted/5">
          <div className="col-span-1 p-2 border-r text-muted-foreground text-right pr-4">
            Holidays
          </div>
          
          {weekDays.map((day, dayIndex) => {
            const dayHolidays = getHolidaysForDay(day);
            
            return (
              <div 
                key={dayIndex} 
                className={`col-span-1 p-2 min-h-12 ${
                  isTodayCheck(day) ? "bg-primary/5" : ""
                } ${dayIndex < 6 ? "border-r" : ""} ${dayHolidays.length > 0 ? "bg-destructive/5" : ""}`}
              >
                {dayHolidays.map(holiday => (
                  <div 
                    key={holiday.id}
                    className="calendar-event text-xs"
                    style={{ backgroundColor: holiday.color || "var(--destructive)" }}
                  >
                    🎉 {holiday.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        
        {/* All Day Events Row */}
        <div className="week-row grid grid-cols-8 border-b bg-muted/10">
          <div className="col-span-1 p-2 border-r text-muted-foreground text-right pr-4 font-semibold text-xs">All Day</div>
          {weekDays.map((day, i) => (
            <div key={i} className="col-span-1 p-2 min-h-[32px]">
              {allDayEventsByDay[format(day, 'yyyy-MM-dd')].map(event => (
                <div key={event.id} className="calendar-event px-2 py-1 rounded bg-primary text-primary-foreground text-xs cursor-pointer mb-1" onClick={() => onEventClick(event)}>
                  {event.title}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {timeSlots.map((hour, hourIndex) => (
          <div 
            key={hourIndex} 
            className="week-row grid grid-cols-8 border-b hover:bg-muted/5"
            ref={currentTime.getHours() === hour ? timeIndicatorRef : null}
          >
            <div className="col-span-1 p-2 border-r text-muted-foreground text-right pr-4">
              {hour === 12 ? "12:00 PM" : hour < 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const slotEvents = getEventsForDayAndHour(day, hour);
              const timeSlotDate = new Date(day);
              timeSlotDate.setHours(hour, 0, 0);
              const dayHolidays = getHolidaysForDay(day);
              
              const isCurrentHourAndToday = isTodayCheck(day) && hour === currentTime.getHours();
              
              return (
                <div 
                  key={dayIndex} 
                  className={`col-span-1 p-2 min-h-16 relative ${
                    isTodayCheck(day) ? "bg-primary/5" : ""
                  } ${dayIndex < 6 ? "border-r" : ""} ${dayHolidays.length > 0 ? "bg-destructive/5" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddEvent) {
                      onAddEvent(timeSlotDate);
                    }
                  }}
                >
                  {/* Current time indicator */}
                  {isCurrentHourAndToday && (
                    <div 
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{
                        top: `${calculateTimeIndicatorPosition()}%`,
                      }}
                    >
                      <div className="flex items-center">
                        <div className="h-[2px] bg-destructive flex-1"></div>
                      </div>
                    </div>
                  )}
                  {slotEvents.length > 0 ? (
                    <div className="event-container">
                      {slotEvents.map(event => (
                        <div 
                          key={event.id}
                          className="calendar-event text-xs cursor-pointer"
                          style={{ backgroundColor: `var(--event-${event.type})` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-[10px] opacity-90">
                            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
