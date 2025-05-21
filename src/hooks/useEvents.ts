import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getStorageItem, setStorageItem } from "@/services/localStorage";

// Mock event types
export type EventType = "work" | "personal" | "meeting" | "reminder" | "other";

// Define Event interface
export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: EventType;
}

/**
 * Converts Date objects to strings for storage
 */
const serializeEvents = (events: Event[]) => {
  return events.map(event => ({
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString()
  }));
};

/**
 * Converts string dates back to Date objects
 */
const deserializeEvents = (events: any[]) => {
  if (!Array.isArray(events)) {
    console.error('Invalid events data in localStorage:', events);
    return [];
  }
  
  return events.map(event => {
    try {
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      };
    } catch (error) {
      console.error('Error deserializing event:', event, error);
      return null;
    }
  }).filter(Boolean) as Event[];
};

/**
 * Custom hook for managing calendar events
 */
export function useEvents(initialEvents: Event[] = []) {
  // Initialize events from localStorage if available, otherwise use initialEvents
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const storedEvents = getStorageItem('events');
      if (storedEvents && Array.isArray(storedEvents) && storedEvents.length > 0) {
        console.log('Loading events from localStorage:', storedEvents.length);
        return deserializeEvents(storedEvents);
      } else {
        console.log('No events found in localStorage, using initial events');
        return initialEvents;
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      return initialEvents;
    }
  });
  
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      const serializedEvents = serializeEvents(events);
      setStorageItem('events', serializedEvents);
      console.log('Events saved to localStorage:', serializedEvents.length);
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);
  
  const handleCreateEvent = (date?: Date) => {
    // If a date is provided, use it as the start/end date for the new event
    let eventDate = date || new Date();
    // Set default start at 9:00 AM and end at 10:00 AM
    const start = new Date(eventDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(eventDate);
    end.setHours(10, 0, 0, 0);
    const defaultEvent = {
      start,
      end,
    };
    setSelectedEvent(undefined); // Ensure we're creating a new event
    setIsEventDialogOpen(true);
    // If date was provided, we'll use it as a default in the form
    return defaultEvent;
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (eventData.id) {
      // Update existing event
      setEvents(prev => 
        prev.map(event => event.id === eventData.id ? { ...event, ...eventData } as Event : event)
      );
      toast({
        title: "Event Updated",
        description: `"${eventData.title}" has been updated.`,
      });
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title || "New Event",
        description: eventData.description || "",
        start: eventData.start || new Date(),
        end: eventData.end || new Date(),
        type: eventData.type as EventType || "other",
      };
      
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Event Created",
        description: `"${newEvent.title}" has been added to your calendar.`,
      });
    }
    
    // Close the dialog after saving
    setIsEventDialogOpen(false);
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setIsEventDialogOpen(false);
      toast({
        title: "Event Deleted",
        description: `"${selectedEvent.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };
  
  // Move an event to a new date/time
  const handleMoveEvent = (event: Event, newStart: Date, newEnd: Date) => {
    // Update the event with new dates
    setEvents(prev => 
      prev.map(e => {
        if (e.id === event.id) {
          return {
            ...e,
            start: newStart,
            end: newEnd
          };
        }
        return e;
      })
    );
    
    toast({
      title: "Event Moved",
      description: `"${event.title}" has been moved to ${format(newStart, 'MMMM d, yyyy')}.`,
    });
  };
  
  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleCreateEvent,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent,
    handleMoveEvent,
  };
}
