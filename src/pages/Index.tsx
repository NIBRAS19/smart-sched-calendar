import React from "react";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import WeekCalendar from "@/components/calendar/WeekCalendar";
import DayCalendar from "@/components/calendar/DayCalendar";
import FloatingActionButton from "@/components/calendar/FloatingActionButton";
import EventDialog from "@/components/calendar/EventDialog";
import EventBottomSheet from "@/components/calendar/EventBottomSheet";
import { useEvents, useCalendarNavigation, useCalendarView, useHolidays } from "@/hooks";
import useSwipeNavigation from "@/hooks/useSwipeNavigation";
import { Event, EventType } from "@/hooks/useEvents";
import { Holiday, HolidayRegion } from "@/hooks/useHolidays";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

// Initialize with empty array of properly typed events
const initialEvents: Event[] = [];

const Index = () => {
  // Use our custom hooks
  const { 
    currentDate, 
    setCurrentDate, 
    goToPrevious, 
    goToNext, 
    goToToday 
  } = useCalendarNavigation();
  
  const { 
    viewType, 
    handleChangeView, 
    getFormattedTitle 
  } = useCalendarView();
  
  const {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleCreateEvent,
    handleSaveEvent,
    handleDeleteEvent,
    handleMoveEvent
  } = useEvents();

  // Initialize with minimal holiday regions (hidden from UI)
  const [selectedRegions] = useState<HolidayRegion[]>(["Global"]);
  const { holidays } = useHolidays(selectedRegions);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Default event for new creations
  const [defaultEvent, setDefaultEvent] = useState<Partial<{start: Date, end: Date}>>({});
  
  // State for mobile bottom sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // Detect if current view is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Update mobile state on window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Reference for swipe navigation
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  
  // Setup swipe navigation
  useSwipeNavigation(calendarContainerRef, {
    onSwipeLeft: () => goToNext(viewType),
    onSwipeRight: () => goToPrevious(viewType)
  });
  
  // Initialize events with mock data only if no events are found in localStorage
  useEffect(() => {
    // Check if events array is empty (meaning no events were loaded from localStorage)
    if (events.length === 0) {
      console.log('No events found in storage, loading mock events');
      setEvents(initialEvents);
    } else {
      console.log('Events loaded from storage, not using mock events');
    }
  }, [events.length, setEvents]);
  
  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    if (viewType === "month") {
      handleChangeView("day");
    }
  };

  const handleCreateEventWithDate = () => {
    // Use the current date as the default for new events
    const defaults = handleCreateEvent(currentDate);
    setDefaultEvent(defaults);
  };
  
  // Handle event clicks - use bottom sheet for mobile and dialog for desktop
  const handleEventClick = (event: any) => {
    // Store the selected event
    setSelectedEvent(event);
    
    // Open the appropriate UI based on device
    if (isMobile) {
      setIsBottomSheetOpen(true);
    } else {
      setIsEventDialogOpen(true);
    }
  };

  // Event handlers for different views
  const handleDayViewSlotClick = (time: Date) => {
    const defaults = handleCreateEvent(time);
    setDefaultEvent(defaults);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile-only header */}
        <header className="sticky top-0 z-30 w-full bg-background border-b flex items-center h-16 px-4 md:hidden">
          {/* Hamburger for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </Button>
          {/* Centered logo/app name */}
          <div className="flex-1 flex justify-center">
            <span className="text-xl font-bold tracking-tight">SmartSched</span>
          </div>
          {/* Theme toggle for mobile */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop header */}
        <Header 
          title={getFormattedTitle(currentDate)}
          onPrevious={() => goToPrevious(viewType)}
          onNext={() => goToNext(viewType)}
          onToday={goToToday}
          onCreateEvent={handleCreateEventWithDate}
          viewType={viewType}
          onChangeView={handleChangeView}
        />
        
        {/* Mobile header with calendar controls */}
        <MobileHeader
          title={getFormattedTitle(currentDate)}
          onPrevious={() => goToPrevious(viewType)}
          onNext={() => goToNext(viewType)}
          onToday={goToToday}
          onCreateEvent={handleCreateEventWithDate}
          viewType={viewType}
          onChangeView={handleChangeView}
        />
        
        <main className="p-4 md:px-8 md:py-6" ref={calendarContainerRef}>
          {viewType === "month" && (
            <div className="mx-auto w-full max-w-[1200px]">
              <MonthCalendar 
                currentDate={currentDate}
                events={events}
                holidays={holidays}
                onSelectDate={handleSelectDate}
                onEventClick={handleEventClick}
                onAddEvent={handleCreateEvent}
                onMoveEvent={handleMoveEvent}
              />
            </div>
          )}
          
          {viewType === "week" && (
            <div className="mx-auto w-full max-w-[1200px]">
              <WeekCalendar
                currentDate={currentDate}
                events={events}
                holidays={holidays}
                onSelectDate={handleSelectDate}
                onEventClick={handleEventClick}
                onAddEvent={handleCreateEvent}
              />
            </div>
          )}
          
          {viewType === "day" && (
            <div className="mx-auto w-full max-w-[1200px]">
              <DayCalendar
                currentDate={currentDate}
                events={events}
                holidays={holidays}
                onEventClick={handleEventClick}
                onSlotClick={handleDayViewSlotClick}
              />
            </div>
          )}
        </main>
        
        {/* Event Dialog for desktop */}
        <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          event={selectedEvent}
          defaultDate={defaultEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
        
        {/* Bottom Sheet for mobile event details */}
        {isBottomSheetOpen && (
          <EventBottomSheet 
            event={selectedEvent}
            onClose={() => setIsBottomSheetOpen(false)}
            onEdit={(event) => {
              setIsBottomSheetOpen(false);
              setIsEventDialogOpen(true);
            }}
            onDelete={() => {
              handleDeleteEvent();
              setIsBottomSheetOpen(false);
            }}
          />
        )}
        
        {/* Floating Action Button for Mobile */}
        <FloatingActionButton onClick={handleCreateEventWithDate} />
        
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex h-[100dvh] w-full md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-sidebar border-r border-sidebar-border p-4 shadow-lg animate-slide-in">
              <Sidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
