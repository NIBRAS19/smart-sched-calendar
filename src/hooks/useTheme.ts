
import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "@/services/localStorage";

type ThemeType = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get theme from our localStorage service
    const storedTheme = getStorageItem("theme");
    
    // Check for system preference if we're using default
    if (storedTheme === "light") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    
    return storedTheme;
  });

  useEffect(() => {
    // Update DOM
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to localStorage using our service
    setStorageItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
