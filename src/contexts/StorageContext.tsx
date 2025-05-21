import React, { createContext, useContext, ReactNode } from 'react';
import { 
  getStorageItem, 
  setStorageItem, 
  removeStorageItem, 
  clearAllStorage, 
  resetToDefaults,
  AppStorage,
  StorageKey
} from '@/services/localStorage';

// Define the context type
interface StorageContextType {
  getItem: <K extends StorageKey>(key: K) => AppStorage[K];
  setItem: <K extends StorageKey>(key: K, value: AppStorage[K]) => void;
  removeItem: (key: StorageKey) => void;
  clearAll: () => void;
  resetAll: () => void;
}

// Create the context with a default value
const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Create a provider component
interface StorageProviderProps {
  children: ReactNode;
}

export function StorageProvider({ children }: StorageProviderProps) {
  // Create the value to be provided by the context
  const contextValue: StorageContextType = {
    getItem: getStorageItem,
    setItem: setStorageItem,
    removeItem: removeStorageItem,
    clearAll: clearAllStorage,
    resetAll: resetToDefaults,
  };

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}

// Custom hook to use the storage context
export function useStorage() {
  const context = useContext(StorageContext);
  
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  
  return context;
}
