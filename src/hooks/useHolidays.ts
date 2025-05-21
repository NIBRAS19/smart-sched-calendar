import { useMemo, useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "@/services/localStorage";

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  region: string;
  color?: string;
}

// Define Kerala holidays for 2023-2025
const keralaHolidays: Holiday[] = [
  // 2023
  { id: "kerala-1-2023", name: "Onam", date: new Date(2023, 8, 7), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-2-2023", name: "Vishu", date: new Date(2023, 3, 15), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-3-2023", name: "Christmas", date: new Date(2023, 11, 25), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-4-2023", name: "Eid al-Fitr", date: new Date(2023, 3, 22), region: "Kerala", color: "var(--event-holiday)" },
  
  // 2024
  { id: "kerala-1-2024", name: "Onam", date: new Date(2024, 8, 15), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-2-2024", name: "Vishu", date: new Date(2024, 3, 14), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-3-2024", name: "Christmas", date: new Date(2024, 11, 25), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-4-2024", name: "Republic Day", date: new Date(2024, 0, 26), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-5-2024", name: "Independence Day", date: new Date(2024, 7, 15), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-6-2024", name: "Gandhi Jayanti", date: new Date(2024, 9, 2), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-7-2024", name: "Eid al-Fitr", date: new Date(2024, 3, 11), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-8-2024", name: "Eid al-Adha", date: new Date(2024, 5, 17), region: "Kerala", color: "var(--event-holiday)" },
  
  // 2025
  { id: "kerala-1-2025", name: "Onam", date: new Date(2025, 8, 5), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-2-2025", name: "Vishu", date: new Date(2025, 3, 14), region: "Kerala", color: "var(--event-holiday)" },
  { id: "kerala-3-2025", name: "Christmas", date: new Date(2025, 11, 25), region: "Kerala", color: "var(--event-holiday)" }
];

// Define UAE holidays for 2023-2025
const uaeHolidays: Holiday[] = [
  // 2023
  { id: "uae-1-2023", name: "New Year", date: new Date(2023, 0, 1), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-2-2023", name: "Eid al-Fitr", date: new Date(2023, 3, 22), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-3-2023", name: "Eid al-Adha", date: new Date(2023, 5, 29), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-4-2023", name: "Islamic New Year", date: new Date(2023, 6, 21), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-5-2023", name: "UAE National Day", date: new Date(2023, 11, 2), region: "UAE", color: "var(--event-holiday)" },
  
  // 2024
  { id: "uae-1-2024", name: "New Year", date: new Date(2024, 0, 1), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-2-2024", name: "Eid al-Fitr", date: new Date(2024, 3, 10), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-3-2024", name: "Eid al-Adha", date: new Date(2024, 5, 17), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-4-2024", name: "Islamic New Year", date: new Date(2024, 6, 8), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-5-2024", name: "Prophet Muhammad's Birthday", date: new Date(2024, 8, 16), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-6-2024", name: "Commemoration Day", date: new Date(2024, 11, 1), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-7-2024", name: "UAE National Day", date: new Date(2024, 11, 2), region: "UAE", color: "var(--event-holiday)" },
  
  // 2025
  { id: "uae-1-2025", name: "New Year", date: new Date(2025, 0, 1), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-2-2025", name: "Eid al-Fitr", date: new Date(2025, 2, 31), region: "UAE", color: "var(--event-holiday)" },
  { id: "uae-3-2025", name: "Eid al-Adha", date: new Date(2025, 5, 7), region: "UAE", color: "var(--event-holiday)" }
];

// Common global holidays
const globalHolidays: Holiday[] = [
  // 2024
  { id: "global-1-2024", name: "New Year", date: new Date(2024, 0, 1), region: "Global", color: "var(--event-holiday)" },
  { id: "global-2-2024", name: "International Women's Day", date: new Date(2024, 2, 8), region: "Global", color: "var(--event-holiday)" },
  { id: "global-3-2024", name: "Earth Day", date: new Date(2024, 3, 22), region: "Global", color: "var(--event-holiday)" },
  
  // 2025
  { id: "global-1-2025", name: "New Year", date: new Date(2025, 0, 1), region: "Global", color: "var(--event-holiday)" }
];

export type HolidayRegion = "Kerala" | "UAE" | "Global" | "All";

export function useHolidays(initialSelectedRegions: HolidayRegion[] = ["All"]) {
  // Load selected regions from localStorage or use initialSelectedRegions
  const [selectedRegions, setSelectedRegions] = useState<HolidayRegion[]>(() => {
    try {
      const storedRegions = getStorageItem('selectedHolidayRegions');
      // Ensure we're returning a properly typed array of HolidayRegion
      return storedRegions?.length ? storedRegions as HolidayRegion[] : initialSelectedRegions;
    } catch (error) {
      console.error('Error loading holiday regions from localStorage:', error);
      return initialSelectedRegions;
    }
  });
  
  // Save selected regions to localStorage when they change
  useEffect(() => {
    try {
      setStorageItem('selectedHolidayRegions', selectedRegions);
    } catch (error) {
      console.error('Error saving holiday regions to localStorage:', error);
    }
  }, [selectedRegions]);
  
  const holidays = useMemo(() => {
    const allHolidays = [...keralaHolidays, ...uaeHolidays, ...globalHolidays];
    
    if (selectedRegions.includes("All")) {
      return allHolidays;
    }
    
    return allHolidays.filter(holiday => 
      selectedRegions.includes(holiday.region as HolidayRegion)
    );
  }, [selectedRegions]);

  const getHolidaysForDate = (date: Date) => {
    if (!date) return [];
    
    return holidays.filter(holiday => 
      holiday.date.getFullYear() === date.getFullYear() &&
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getDate() === date.getDate()
    );
  };

  return {
    holidays,
    getHolidaysForDate,
    regions: ["Kerala", "UAE", "Global", "All"] as HolidayRegion[],
    selectedRegions,
    setSelectedRegions
  };
}
