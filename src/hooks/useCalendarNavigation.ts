
import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "@/services/localStorage";
import { 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays,
  startOfMonth,
  startOfWeek,
  startOfDay,
} from "date-fns";

/**
 * Custom hook for managing calendar navigation and date manipulation
 */
export function useCalendarNavigation(initialDate: Date = new Date()) {
  // Load saved date from localStorage, or use initialDate
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    try {
      const storedDate = getStorageItem('currentDate');
      return storedDate ? new Date(storedDate) : initialDate;
    } catch (error) {
      console.error('Error loading date from localStorage:', error);
      return initialDate;
    }
  });
  
  // Save current date to localStorage whenever it changes
  useEffect(() => {
    try {
      setStorageItem('currentDate', currentDate.toISOString());
    } catch (error) {
      console.error('Error saving date to localStorage:', error);
    }
  }, [currentDate]);
  
  // Navigation functions
  const goToPrevious = (viewType: string) => {
    switch (viewType) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };
  
  const goToNext = (viewType: string) => {
    switch (viewType) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Helper functions for specific view starting dates
  const getStartOfMonth = () => startOfMonth(currentDate);
  const getStartOfWeek = () => startOfWeek(currentDate, { weekStartsOn: 0 });
  const getStartOfDay = () => startOfDay(currentDate);
  
  return {
    currentDate,
    setCurrentDate,
    goToPrevious,
    goToNext,
    goToToday,
    getStartOfMonth,
    getStartOfWeek,
    getStartOfDay
  };
}
