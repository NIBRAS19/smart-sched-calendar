import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X, CalendarDays } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 w-full bg-background border-b flex items-center h-16 px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </Button>

          <div className="flex-1 flex justify-center">
            <span className="text-xl font-bold tracking-tight">SmartSched</span>
          </div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>

        {/* Sidebar Overlay for mobile */}
        <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible'}`}>
          {/* Background overlay */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOverlayClick}
          />

          {/* Sidebar Slide Panel */}
          <div
            className={`fixed left-0 top-0 w-72 h-full bg-background border-r shadow-xl transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col z-[60]`}
          >
            {/* Close button inside header */}
            <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-[61]">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <CalendarDays size={22} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">SmartSched</h1>
                  <p className="text-xs text-muted-foreground">Smart Calendar App</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 border border-muted hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
