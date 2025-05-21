
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getStorageItem, setStorageItem } from "@/services/localStorage";

type ViewType = "month" | "week" | "day";

/**
 * Custom hook for managing calendar view type
 */
export function useCalendarView(initialViewType: ViewType = "month") {
  // Load the saved view type from localStorage, or use the provided initialViewType
  const [viewType, setViewType] = useState<ViewType>(() => {
    return getStorageItem('calendarView') || initialViewType;
  });
  
  // Save view type to localStorage whenever it changes
  useEffect(() => {
    setStorageItem('calendarView', viewType);
  }, [viewType]);
  
  const handleChangeView = (view: ViewType) => {
    setViewType(view);
  };
  
  // Format title based on view type
  const getFormattedTitle = (currentDate: Date) => {
    switch (viewType) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        return `Week of ${format(currentDate, "MMM d, yyyy")}`;
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };
  
  return {
    viewType,
    setViewType,
    handleChangeView,
    getFormattedTitle
  };
}
