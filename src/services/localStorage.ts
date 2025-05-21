/**
 * A service that provides a unified interface for working with localStorage
 * with type safety, error handling, and a consistent approach to key naming
 */

// Define the structure of the application storage
export interface AppStorage {
  theme: 'light' | 'dark';
  events: Array<{
    id: string;
    title: string;
    description: string;
    start: string; // ISO string format
    end: string;   // ISO string format
    type: 'work' | 'personal' | 'meeting' | 'reminder' | 'other';
  }>;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string; // ISO string format
    priority: 'low' | 'medium' | 'high';
    relatedEvent?: string;
    description?: string;
    tags?: string[];
    dateCreated: string; // ISO string format
  }>;
  calendarView: 'month' | 'week' | 'day';
  currentDate: string; // ISO string format
  userSettings: {
    name: string;
    email: string;
    notifications: boolean;
    emailAlerts: boolean;
    view24Hour: boolean;
    weekStartsOn: 'sunday' | 'monday';
    defaultView: 'month' | 'week' | 'day';
    defaultDuration: number;
    language: string;
  };
  selectedHolidayRegions: string[];
}

// Type for the keys of AppStorage
export type StorageKey = keyof AppStorage;

// Default values for when storage is empty
const defaultStorage: AppStorage = {
  theme: 'light',
  events: [],
  tasks: [],
  calendarView: 'month',
  currentDate: new Date().toISOString(),
  userSettings: {
    name: 'Guest User',
    email: 'guest@example.com',
    notifications: true,
    emailAlerts: false,
    view24Hour: false,
    weekStartsOn: 'sunday',
    defaultView: 'month',
    defaultDuration: 30,
    language: 'english',
  },
  selectedHolidayRegions: ['Global'],
};

// Prefix for all storage keys to avoid conflicts with other apps
const KEY_PREFIX = 'smart-sched:';

/**
 * Gets a value from localStorage using the provided key
 * @param key Key to retrieve from storage
 * @returns The stored value or default if not found
 */
export function getStorageItem<K extends StorageKey>(key: K): AppStorage[K] {
  try {
    const fullKey = `${KEY_PREFIX}${key}`;
    const item = localStorage.getItem(fullKey);
    
    if (!item) {
      console.log(`No item found for key ${fullKey}, returning default`);
      return defaultStorage[key];
    }
    
    try {
      const parsed = JSON.parse(item);
      return parsed;
    } catch (parseError) {
      console.error(`Error parsing JSON for ${fullKey}:`, parseError);
      return defaultStorage[key];
    }
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultStorage[key];
  }
}

/**
 * Stores a value in localStorage using the provided key
 * @param key Key to store the value under
 * @param value Value to store
 */
export function setStorageItem<K extends StorageKey>(key: K, value: AppStorage[K]): void {
  try {
    const fullKey = `${KEY_PREFIX}${key}`;
    const valueToStore = JSON.stringify(value);
    
    // Check if the value is valid before storing
    if (valueToStore === undefined) {
      console.error(`Cannot store undefined value for key ${fullKey}`);
      return;
    }
    
    // Try to store the value
    try {
      localStorage.setItem(fullKey, valueToStore);
      console.log(`Successfully stored data for key ${fullKey}`);
    } catch (storageError) {
      // Handle quota exceeded or other storage errors
      if (storageError.name === 'QuotaExceededError' || 
          storageError.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error('localStorage quota exceeded');
      } else {
        console.error(`Error storing data for key ${fullKey}:`, storageError);
      }
    }
  } catch (error) {
    console.error(`Error preparing data for ${key}:`, error);
  }
}

/**
 * Removes a specific item from localStorage
 * @param key Key to remove
 */
export function removeStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(`${KEY_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Clears all application data from localStorage
 */
export function clearAllStorage(): void {
  try {
    // Only remove keys with our prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Resets all application data to defaults
 */
export function resetToDefaults(): void {
  try {
    // Clear existing data
    clearAllStorage();
    
    // Set default values for all storage keys
    Object.keys(defaultStorage).forEach(key => {
      const storageKey = key as StorageKey;
      setStorageItem(storageKey, defaultStorage[storageKey]);
    });
  } catch (error) {
    console.error('Error resetting localStorage to defaults:', error);
  }
}
