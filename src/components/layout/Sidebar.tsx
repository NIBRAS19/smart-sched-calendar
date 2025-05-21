import { 
  CalendarDays, 
  ListTodo, 
  Settings, 
  UserCircle, 
  Search,
  ChevronRight,
  Check,
  Plus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSearch } from "@/hooks/useSearch";
import { getStorageItem } from "@/services/localStorage";
import { format, isToday, isAfter, startOfToday } from "date-fns";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  tags?: string[];
  dateCreated: Date;
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");

  // Get tasks from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = getStorageItem('tasks');
      if (storedTasks && Array.isArray(storedTasks) && storedTasks.length > 0) {
        return storedTasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          dateCreated: new Date(task.dateCreated)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  // Set up search
  const { results: searchResults } = useSearch<Task>({
    items: tasks,
    searchFields: ['title', 'description', 'tags'],
    initialQuery: searchQuery
  });

  // Get high priority tasks
  const highPriorityTasks = tasks
    .filter(task => !task.completed && task.priority === 'high')
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return a.dueDate.getTime() - b.dueDate.getTime();
    })
    .slice(0, 3);

  const handleTaskClick = (taskId: string) => {
    navigate('/tasks');
    if (onClose) onClose();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Filter tasks based on search query
      const filteredTasks = tasks.filter(task => {
        const searchLower = query.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descMatch = task.description?.toLowerCase().includes(searchLower);
        const tagsMatch = task.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        return titleMatch || descMatch || tagsMatch;
      });

      // Navigate to tasks page with search results
      navigate('/tasks', { state: { searchResults: filteredTasks } });
      if (onClose) onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <CalendarDays size={22} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">SmartSched</h1>
                  <p className="text-xs text-muted-foreground">Smart Calendar App</p>
                </div>
              </div>
            </div>

          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
            placeholder="Search tasks..."
                className="w-full pl-9 bg-muted/50 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-6 overflow-auto no-scrollbar">
            <div className="space-y-1">
              <h2 className="font-semibold text-muted-foreground ml-2 text-xs uppercase tracking-wider">Navigation</h2>
              
              <SidebarLink 
                to="/calendar" 
                icon={<CalendarDays size={20} />} 
                text="Calendar" 
                active={location.pathname === '/calendar'}
                onClick={onClose}
              />
              <SidebarLink 
                to="/tasks" 
                icon={<ListTodo size={20} />} 
                text="Tasks" 
                active={location.pathname === '/tasks'}
                onClick={onClose}
              />
              <SidebarLink 
                to="/settings" 
                icon={<Settings size={20} />} 
                text="Settings" 
                active={location.pathname === '/settings'}
                onClick={onClose}
              />
            </div>
            
        {/* High Priority Tasks Section */}
        {highPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <h2 className="font-semibold text-muted-foreground ml-2 text-xs uppercase tracking-wider flex items-center gap-1">
                <Star size={12} className="text-yellow-500" />
                High Priority
              </h2>
              </div>
              
              <div className="space-y-2">
              {highPriorityTasks.map(task => (
                <div 
                  key={task.id} 
                  className="group p-2 rounded-lg flex items-start gap-3 hover:bg-muted/40 cursor-pointer"
                  onClick={() => handleTaskClick(task.id)}
                  >
                    <Button 
                      variant="outline" 
                      size="icon" 
                    className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5 bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                    >
                    <Star size={12} />
                    </Button>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate ? format(task.dueDate, "MMM d, h:mm a") : "No due date"}
                    </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
        )}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/images/profile.png" alt="Profile" />
                <AvatarFallback>
                  <UserCircle size={32} className="text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Guest User</p>
                <Link to="/auth/login" className="text-xs text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
      </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ to, icon, text, badge, active, onClick }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors
        ${active 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground hover:bg-muted"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{text}</span>
      </div>
      
      {badge && (
        <Badge variant="outline" className={active ? "bg-primary-foreground text-primary border-primary-foreground" : ""}>{badge}</Badge>
      )}
    </Link>
  );
}
