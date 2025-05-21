
import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, getDay, setHours, setMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Holiday } from "@/hooks/useHolidays";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DroppableCell from "./DroppableCell";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface MonthCalendarProps {
  currentDate: Date;
  events: Event[];
  holidays?: Holiday[];
  onSelectDate: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onAddEvent?: (date: Date) => void;
  onMoveEvent?: (event: Event, newStart: Date, newEnd: Date) => void;
}

export default function MonthCalendar({ 
  currentDate, 
  events, 
  holidays = [],
  onSelectDate,
  onEventClick,
  onAddEvent,
  onMoveEvent,
}: MonthCalendarProps) {
  // Get all days in the current month
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const firstDay = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
    
    // Get days from previous month to fill the first row
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => 
      addDays(monthStart, -(firstDay - i))
    );
    
    // Get all days in the current month
    const daysInMonth = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    });
    
    // Calculate how many days we need from next month
    const totalCells = Math.ceil((firstDay + daysInMonth.length) / 7) * 7;
    const nextMonthDays = Array.from(
      { length: totalCells - (firstDay + daysInMonth.length) },
      (_, i) => addDays(monthEnd, i + 1)
    );
    
    return [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  }, [currentDate]);
  
  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    
    events.forEach(event => {
      const dateStr = format(event.start, 'yyyy-MM-dd');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    });
    
    return grouped;
  }, [events]);
  
  // Get holiday by date
  const holidaysByDate = useMemo(() => {
    const grouped: Record<string, Holiday[]> = {};
    
    holidays.forEach(holiday => {
      const dateStr = format(holiday.date, 'yyyy-MM-dd');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(holiday);
    });
    
    return grouped;
  }, [holidays]);
  
  // Handle event movement between dates
  const handleMoveEvent = (event: Event, targetDate: Date) => {
    if (onMoveEvent) {
      try {
        // Calculate time difference between start and end
        const diffMs = event.end.getTime() - event.start.getTime();
        
        // Create new dates while preserving the time
        const newStart = new Date(targetDate);
        // Preserve the original time
        newStart.setHours(event.start.getHours());
        newStart.setMinutes(event.start.getMinutes());
        
        // Calculate new end date based on the same duration
        const newEnd = new Date(newStart.getTime() + diffMs);
        
        console.log('Moving event:', {
          event: event.title,
          from: event.start.toISOString(),
          to: newStart.toISOString(),
          diffMs
        });
        
        onMoveEvent(event, newStart, newEnd);
      } catch (error) {
        console.error('Error moving event:', error, event, targetDate);
      }
    }
  };
  
  const today = new Date();
  
  // Day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar bg-card rounded-xl shadow-sm overflow-hidden border">
        <div className="calendar-grid">
          {dayNames.map(day => (
            <div key={day} className="calendar-header-cell border-b">
              {day}
            </div>
          ))}
          
          {monthDays.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateStr] || [];
            const dayHolidays = holidaysByDate[dateStr] || [];
            const isThisToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <DroppableCell
                key={i}
                day={day}
                isToday={isThisToday}
                isCurrentMonth={isCurrentMonth}
                dayEvents={dayEvents}
                dayHolidays={dayHolidays}
                onAddEvent={onAddEvent}
                onSelectDate={onSelectDate}
                onEventClick={onEventClick}
                onMoveEvent={(event, targetDate) => handleMoveEvent(event, targetDate)}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}
