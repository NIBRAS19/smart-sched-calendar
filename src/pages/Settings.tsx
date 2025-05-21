import React, { useState, useEffect } from "react";
import { useStorage } from "@/contexts/StorageContext";
import Sidebar from "@/components/layout/Sidebar";
import SettingsHeader from "@/components/layout/SettingsHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { 
  Moon, 
  Sun, 
  Bell, 
  BellOff, 
  Globe, 
  Languages, 
  Settings as SettingsIcon, 
  Menu, 
  User,
  Calendar,
  Bell as BellIcon,
  Palette,
  HelpCircle,
  Lock
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import SettingsCard from "@/components/settings/SettingsCard";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Access the storage context
  const { getItem, setItem, resetAll } = useStorage();

  // Load settings from localStorage
  type WeekStartsOn = 'sunday' | 'monday';
  type DefaultView = 'month' | 'week' | 'day';

  interface UserSettings {
    name: string;
    email: string;
    notifications: boolean;
    emailAlerts: boolean;
    view24Hour: boolean;
    weekStartsOn: WeekStartsOn;
    defaultView: DefaultView;
    defaultDuration: number;
    language: string;
  }

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const storedSettings = getItem('userSettings') as UserSettings | undefined;
      return storedSettings || {
        name: "Guest User",
        email: "guest@example.com",
        notifications: true,
        emailAlerts: false,
        view24Hour: false,
        weekStartsOn: "sunday" as WeekStartsOn,
        defaultView: "month" as DefaultView,
        defaultDuration: 30,
        language: "english",
      };
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return {
        name: "Guest User",
        email: "guest@example.com",
        notifications: true,
        emailAlerts: false,
        view24Hour: false,
        weekStartsOn: "sunday",
        defaultView: "month",
        defaultDuration: 30,
        language: "english",
      };
    }
  });
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      setItem('userSettings', userSettings);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [userSettings, setItem]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Settings are already saved via the useEffect hook
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated.",
    });
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // Settings are already saved via the useEffect hook
    toast({
      title: "Preferences saved",
      description: "Your calendar preferences have been updated.",
    });
  };
  
  const handleResetApp = () => {
    // Reset all app data to defaults
    resetAll();
    // Reset theme
    setTheme("light");
    // Reset user settings to defaults
    setUserSettings({
      name: "Guest User",
      email: "guest@example.com",
      notifications: true,
      emailAlerts: false,
      view24Hour: false,
      weekStartsOn: "sunday" as WeekStartsOn,
      defaultView: "month" as DefaultView,
      defaultDuration: 30,
      language: "english",
    });
    toast({
      title: "App Reset Complete",
      description: "All app data has been reset to default values.",
      variant: "destructive"
    });
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
        <SettingsHeader 
          title="Settings"
          subtitle="Customize your calendar experience"
          onSaveSettings={() => {
            // Create a synthetic React form event
            const syntheticEvent = {
              preventDefault: () => {}
            } as React.FormEvent;
            handleSavePreferences(syntheticEvent);
          }}
        />
        
        {/* Main content with improved padding and centered layout */}
        <div className="p-4 md:px-8 md:py-6">
          <div className="mx-auto w-full max-w-[1200px]">
            {/* Header shown only on mobile - on desktop we use SettingsHeader component */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:hidden">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Customize your calendar experience</p>
              </div>
              <Button className="w-full md:w-auto" onClick={handleSavePreferences}>
                Save All Changes
              </Button>
            </div>

            <div className="space-y-8">
              {/* Profile Settings */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={18} className="text-primary" /> Profile
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <SettingsCard
                    icon={<User size={18} />}
                    title="Personal Information"
                    description="Update your name and contact details"
                  >
                    <form className="space-y-4" onSubmit={handleSaveProfile}>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={userSettings.name}
                            onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email"  
                            type="email"
                            value={userSettings.email}
                            onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </form>
                  </SettingsCard>
                  
                  <SettingsCard
                    icon={<Lock size={18} />}
                    title="Password"
                    description="Secure your account with a strong password"
                  >
                    <form className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="current">Current Password</Label>
                          <Input id="current" type="password" className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="new">New Password</Label>
                          <Input id="new" type="password" className="mt-1.5" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">Change Password</Button>
                    </form>
                  </SettingsCard>
                </div>
              </section>
              {/* Calendar Settings */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Calendar
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <SettingsCard
                    icon={<Calendar size={18} />}
                    title="Calendar Display"
                    description="Customize your calendar view preferences"
                  >
                    <form className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="week-start">Week Starts On</Label>
                          <Select 
                            value={userSettings.weekStartsOn} 
                            onValueChange={(value: WeekStartsOn) => setUserSettings({...userSettings, weekStartsOn: value})}
                          >
                            <SelectTrigger id="week-start" className="mt-1.5">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sunday">Sunday</SelectItem>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="default-view">Default View</Label>
                          <Select 
                            value={userSettings.defaultView} 
                            onValueChange={(value: DefaultView) => setUserSettings({...userSettings, defaultView: value})}
                          >
                            <SelectTrigger id="default-view" className="mt-1.5">
                              <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Month</SelectItem>
                              <SelectItem value="week">Week</SelectItem>
                              <SelectItem value="day">Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </form>
                  </SettingsCard>
                  
                  <SettingsCard
                    icon={<Palette size={18} />}
                    title="Appearance"
                    description="Customize the look and feel"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label>Theme</Label>
                        <div className="flex space-x-2">
                          <div 
                            className={`flex-1 flex items-center gap-3 p-3 border-2 rounded-md ${theme === 'light' ? 'border-primary' : 'border-transparent hover:border-muted cursor-pointer'}`}
                            onClick={() => setTheme('light')}
                          >
                            <div>
                              <h3 className="font-medium text-sm">Light</h3>
                              <p className="text-xs text-muted-foreground">Brighter appearance</p>
                            </div>
                            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-slate-100 border border-slate-200">
                              <Sun size={20} className="text-slate-600" />
                            </div>
                          </div>
                          <div 
                            className={`flex-1 flex items-center gap-3 p-3 border-2 rounded-md ${theme === 'dark' ? 'border-primary' : 'border-transparent hover:border-muted cursor-pointer'}`}
                            onClick={() => setTheme('dark')}
                          >
                            <div>
                              <h3 className="font-medium text-sm">Dark</h3>
                              <p className="text-xs text-muted-foreground">Darker appearance</p>
                            </div>
                            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-slate-900 border border-slate-700">
                              <Moon size={20} className="text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SettingsCard>
                  
                  <SettingsCard
                    icon={<Globe size={18} />}
                    title="Language & Format"
                    description="Set your language and time format"
                  >
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={userSettings.language} 
                          onValueChange={(value) => setUserSettings({...userSettings, language: value})}
                        >
                          <SelectTrigger id="language" className="mt-1.5">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm">24-Hour Time</h3>
                          <p className="text-xs text-muted-foreground">Show times in 24-hour format</p>
                        </div>
                        <Switch 
                          checked={userSettings.view24Hour}
                          onCheckedChange={(checked) => setUserSettings({...userSettings, view24Hour: checked})}
                        />
                      </div>
                    </div>
                  </SettingsCard>
                </div>
              </section>

              {/* Notifications Settings */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BellIcon size={18} className="text-primary" /> Notifications
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <SettingsCard
                    icon={<BellIcon size={18} />}
                    title="Notifications"
                    description="Set up event reminders and alerts"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm">Push Notifications</h3>
                          <p className="text-xs text-muted-foreground">Get notified in browser</p>
                        </div>
                        <Switch 
                          checked={userSettings.notifications}
                          onCheckedChange={(checked) => setUserSettings({...userSettings, notifications: checked})}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm">Email Alerts</h3>
                          <p className="text-xs text-muted-foreground">Receive email notifications</p>
                        </div>
                        <Switch 
                          checked={userSettings.emailAlerts}
                          onCheckedChange={(checked) => setUserSettings({...userSettings, emailAlerts: checked})}
                        />
                      </div>
                    </div>
                  </SettingsCard>
                </div>
              </section>

              {/* Help & Support */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle size={18} className="text-primary" /> Help & Support
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <SettingsCard
                    icon={<HelpCircle size={18} />}
                    title="Help & Support"
                    description="Get help with using the app"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Documentation</div>
                            <div className="text-sm text-muted-foreground">Read our user guide and FAQ</div>
                          </div>
                          <Button variant="outline">View</Button>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Contact Support</div>
                            <div className="text-sm text-muted-foreground">Get help from our support team</div>
                          </div>
                          <Button variant="outline">Contact</Button>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-destructive">Reset App Data</div>
                            <div className="text-sm text-muted-foreground">Clear all stored data and reset to default settings</div>
                          </div>
                          <Button 
                            variant="destructive" 
                            onClick={handleResetApp}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SettingsCard>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        {/* Sidebar slide-in for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="relative z-50 w-64 bg-sidebar border-r h-full shadow-xl animate-slide-in-left">
              <Sidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
