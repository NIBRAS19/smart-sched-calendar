import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StorageProvider } from "./contexts/StorageContext";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import { NotificationsProvider } from "./utils/notificationUtils";
import Features from "./pages/Features";
import Benefits from "./pages/Benefits";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StorageProvider>
      <TooltipProvider>
        <NotificationsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename= "/smart-sched-calendar">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/calendar" element={<Index />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth/:type" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </TooltipProvider>
    </StorageProvider>
  </QueryClientProvider>
);

export default App;
