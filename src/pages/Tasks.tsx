import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getStorageItem, setStorageItem } from "@/services/localStorage";
import Sidebar from "@/components/layout/Sidebar";
import TasksHeader from "@/components/layout/TasksHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarDays, 
  Plus, 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  Star, 
  X, 
  Filter, 
  Search, 
  Menu, 
  Tag as TagIcon, 
  BarChart,
  ArrowUpDown,
  ChevronDown  
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import TaskItem from "@/components/tasks/TaskItem";
import DraggableTaskItem from "@/components/tasks/DraggableTaskItem";
import TaskFilter from "@/components/tasks/TaskFilter";
import { format, isSameDay, isAfter, addDays, startOfToday, isValid, isPast, isToday, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useNotificationsContext } from "@/utils/notificationUtils";
import { useSearch } from "@/hooks/useSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  relatedEvent?: string;
  description?: string;
  tags?: string[];
  dateCreated: Date;
}

// Initialize with empty array of tasks
const initialTasks: Task[] = [];

export default function Tasks() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { addNotification } = useNotificationsContext();
  const taskInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filter and sort states
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("dueDate");
  const [showCompleted, setShowCompleted] = useState(true);
  
  // New task states
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("");
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  // Display states
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  
  // Initialize tasks from localStorage or use mock data
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
      return initialTasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return initialTasks;
    }
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      const serializedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
        dateCreated: task.dateCreated.toISOString()
      }));
      setStorageItem('tasks', serializedTasks);
      console.log('Tasks saved to localStorage:', serializedTasks.length);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  // Set up search
  const { query, setQuery, results: filteredBySearch } = useSearch<Task>({
    items: tasks,
    searchFields: ['title', 'relatedEvent', 'description', 'tags'],
    initialQuery: ''
  });

  // Get all unique tags across all tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Filter and sort tasks based on all criteria
  const filteredTasks = useMemo(() => {
    // First apply search filter
    let tasksToFilter = query ? filteredBySearch : tasks;
    const today = startOfToday();
    
    // Then apply tab filter
    switch (activeTab) {
      case "today":
        tasksToFilter = tasksToFilter.filter(task => task.dueDate && isSameDay(task.dueDate, today));
        break;
        
      case "upcoming":
        tasksToFilter = tasksToFilter.filter(task => 
          task.dueDate && 
          isAfter(task.dueDate, today) && 
          !isSameDay(task.dueDate, today)
        );
        break;
        
      case "completed":
        tasksToFilter = tasksToFilter.filter(task => task.completed);
        break;
    }
    
    // Apply filters
    if (priorityFilter !== "all") {
      tasksToFilter = tasksToFilter.filter(task => task.priority === priorityFilter);
    }
    
    if (dateFilter) {
      tasksToFilter = tasksToFilter.filter(task => 
        task.dueDate && isSameDay(task.dueDate, dateFilter)
      );
    }
    
    if (tagFilter.length > 0) {
      tasksToFilter = tasksToFilter.filter(task => 
        task.tags && tagFilter.some(tag => task.tags?.includes(tag))
      );
    }
    
    if (!showCompleted) {
      tasksToFilter = tasksToFilter.filter(task => !task.completed);
    }
    
    // Apply sorting
    return tasksToFilter.sort((a, b) => {
      // First sort by completion status if showing both completed and uncompleted
      if (showCompleted && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then apply selected sort option
      switch (sortOption) {
        case "dueDate":
          // Tasks with due dates come first
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
          if (!a.dueDate && !b.dueDate) return 0;
          // Then sort by date (ascending)
          return a.dueDate && b.dueDate ? a.dueDate.getTime() - b.dueDate.getTime() : 0;
          
        case "priority":
          // Map priority to numeric value for comparison
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
          
        case "title":
          return a.title.localeCompare(b.title);
          
        case "dateCreated":
          return b.dateCreated.getTime() - a.dateCreated.getTime(); // Newest first
          
        default:
          return 0;
      }
    });
  }, [
    tasks, 
    activeTab, 
    filteredBySearch, 
    query, 
    priorityFilter, 
    dateFilter, 
    tagFilter,
    sortOption,
    showCompleted
  ]);
  
  // Filter tasks by selected date in calendar
  const tasksByDate = useMemo(() => {
    if (!selectedDate || !isValid(selectedDate)) return [];
    return tasks.filter(task => task.dueDate && isSameDay(task.dueDate, selectedDate));
  }, [tasks, selectedDate]);

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const dueToday = tasks.filter(task => !task.completed && task.dueDate && isToday(task.dueDate)).length;
    const overdue = tasks.filter(task => !task.completed && task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate)).length;
    const upcoming = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      isAfter(task.dueDate, startOfToday()) && 
      !isToday(task.dueDate)
    ).length;
    const highPriority = tasks.filter(task => !task.completed && task.priority === "high").length;
    
    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      dueToday,
      overdue,
      upcoming,
      highPriority,
      completionRate
    };
  }, [tasks]);

  // Handle add task
  const addTask = () => {
    if (newTask.trim() === "") return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      dueDate: selectedDate,
      priority,
      description: newTaskDescription.trim() || undefined,
      tags: newTaskTags.length > 0 ? [...newTaskTags] : undefined,
      dateCreated: new Date()
    };

    setTasks([...tasks, task]);
    resetTaskForm();
    
    toast({
      title: "Task added",
      description: "Your new task has been created",
    });
    
    // Add a notification
    addNotification("New Task Created", `Task "${newTask}" has been added to your list`);
  };

  // Reset the task form
  const resetTaskForm = () => {
    setNewTask("");
    setNewTaskDescription("");
    setNewTaskTags([]);
    setIsTaskFormOpen(false);
  };

  // Add a tag to a new task
  const addTagToNewTask = () => {
    if (!newTaskTag.trim()) return;
    if (!newTaskTags.includes(newTaskTag.trim())) {
      setNewTaskTags([...newTaskTags, newTaskTag.trim()]);
    }
    setNewTaskTag("");
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };

  // Remove a tag from a new task
  const removeTagFromNewTask = (tagToRemove: string) => {
    setNewTaskTags(newTaskTags.filter(tag => tag !== tagToRemove));
  };

  // Toggle task completion status
  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          
          toast({
            title: updatedTask.completed ? "Task completed" : "Task reopened",
            description: updatedTask.title,
          });
          
          if (updatedTask.completed) {
            addNotification("Task Completed", `You've completed "${updatedTask.title}"`);
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter((task) => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: taskToDelete ? `"${taskToDelete.title}" has been removed` : "Task removed",
      variant: "destructive",
    });
    
    if (taskToDelete) {
      addNotification("Task Deleted", `Task "${taskToDelete.title}" has been removed`);
    }
  };

  // Move task (for drag and drop)
  const moveTask = (dragIndex: number, hoverIndex: number) => {
    // Create a copy of the tasks array
    const updatedTasks = [...filteredTasks];
    
    // Remove the dragged task
    const draggedTask = updatedTasks[dragIndex];
    
    // Remove the task from the original position
    updatedTasks.splice(dragIndex, 1);
    
    // Insert the task at the new position
    updatedTasks.splice(hoverIndex, 0, draggedTask);
    
    // Update the tasks array with the new order
    // We need to update the original tasks array, not just the filtered one
    const updatedAllTasks = [...tasks];
    
    // Find the tasks in the original array and update their order
    updatedTasks.forEach((task, index) => {
      const originalIndex = updatedAllTasks.findIndex(t => t.id === task.id);
      if (originalIndex !== -1) {
        const taskToMove = updatedAllTasks[originalIndex];
        updatedAllTasks.splice(originalIndex, 1);
        updatedAllTasks.splice(index, 0, taskToMove);
      }
    });
    
    setTasks(updatedAllTasks);
  };

  // Edit a task
  const editTask = (id: string, updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === id ? updatedTask : task
    ));
    
    toast({
      title: "Task updated",
      description: "Changes to the task have been saved",
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPriorityFilter("all");
    setDateFilter(undefined);
    setTagFilter([]);
    setShowCompleted(true);
    setSortOption("dueDate");
  };

  // Effect to focus input when search is active
  useEffect(() => {
    if (isSearchActive) {
      const searchInput = document.getElementById('task-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, [isSearchActive]);
  
  // Focus on task input when form is opened
  useEffect(() => {
    if (isTaskFormOpen && taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [isTaskFormOpen]);

  // Quick add task input ref
  const quickAddInputRef = useRef<HTMLInputElement>(null);

  // Focus quick add input when form opens
  useEffect(() => {
    if (isTaskFormOpen && quickAddInputRef.current) {
      quickAddInputRef.current.focus();
    }
  }, [isTaskFormOpen]);

  // Handle quick add task (title only)
  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    addTask();
    // Keep form open and focus input for rapid entry
    setIsTaskFormOpen(true);
    if (quickAddInputRef.current) quickAddInputRef.current.focus();
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
        <TasksHeader
          title="Tasks"
          subtitle="Manage your tasks and to-dos"
          onAddTask={() => setNewTask('')}
        />
        
        {/* Main content with improved padding and centered layout */}
        <div className="p-4 md:px-8 md:py-6">
          <div className="mx-auto w-full max-w-[1200px]">
            {/* Header shown only on mobile - on desktop we use TasksHeader component */}
            <header className="mb-6 md:mb-8 md:hidden">
              <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage your tasks and to-dos</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card className="shadow-md">
                  <CardHeader className="bg-muted/30 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        Tasks
                      </CardTitle>
                      
                      {isSearchActive ? (
                        <div className="w-full sm:w-auto flex items-center rounded-md border overflow-hidden bg-background">
                          <Input 
                            id="task-search-input"
                            placeholder="Search tasks..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-0 focus-visible:ring-0"
                            autoFocus
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setQuery('');
                              setIsSearchActive(false);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="sm:hidden"
                            onClick={() => setIsSearchActive(true)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          
                          <div className="hidden sm:flex items-center rounded-md border overflow-hidden bg-background w-[200px] h-9">
                            <Search className="h-4 w-4 ml-2 text-muted-foreground" />
                            <Input 
                              placeholder="Search tasks..." 
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="border-0 focus-visible:ring-0 h-9"
                            />
                          </div>
                          
                          <TaskFilter
                            priorityFilter={priorityFilter}
                            dateFilter={dateFilter}
                            tagFilter={tagFilter}
                            sortOption={sortOption}
                            showCompleted={showCompleted}
                            onChangePriority={setPriorityFilter}
                            onChangeDate={setDateFilter}
                            onChangeTagFilter={setTagFilter}
                            onChangeSortOption={setSortOption}
                            onChangeShowCompleted={setShowCompleted}
                            onClearFilters={clearAllFilters}
                            availableTags={availableTags}
                          />
                          
                          <Button 
                            onClick={() => setNewTask('')}
                            size="sm"
                            className="gap-1 h-8"
                          >
                            <Plus className="h-4 w-4" /> Add Task
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      Organize, track and complete your tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="mb-6 w-full grid grid-cols-4 h-auto p-1">
                        <TabsTrigger value="all" className="py-2">
                          All <span className="ml-1.5 text-xs rounded-full bg-muted px-2 py-0.5">{tasks.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="today" className="py-2">
                          Today <span className="ml-1.5 text-xs rounded-full bg-muted px-2 py-0.5">{tasks.filter(t => t.dueDate && isToday(t.dueDate)).length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="py-2">
                          Upcoming <span className="ml-1.5 text-xs rounded-full bg-muted px-2 py-0.5">{tasks.filter(t => t.dueDate && isAfter(t.dueDate, addDays(new Date(), 1))).length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="py-2">
                          Completed <span className="ml-1.5 text-xs rounded-full bg-muted px-2 py-0.5">{tasks.filter(t => t.completed).length}</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-1">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center p-8 bg-muted/20 rounded-lg mt-4">
                            <Check className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No tasks found</p>
                            <p className="text-muted-foreground text-sm">Add a new task or clear your filters</p>
                          </div>
                        ) : (
                          <DndProvider backend={HTML5Backend}>
                            <div className="rounded-md overflow-hidden border mt-4 bg-card">
                              {filteredTasks.map((task, index) => (
                                <div key={task.id} className="border-b last:border-0">
                                  <DraggableTaskItem
                                    task={task}
                                    index={index}
                                    onToggleComplete={toggleComplete}
                                    onDelete={deleteTask}
                                    onEdit={editTask}
                                    onMoveTask={moveTask}
                                  />
                                </div>
                              ))}
                            </div>
                          </DndProvider>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="today" className="space-y-1">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center p-8 bg-muted/20 rounded-lg mt-4">
                            <Check className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No tasks due today</p>
                            <p className="text-muted-foreground text-sm">Enjoy your day!</p>
                          </div>
                        ) : (
                          <DndProvider backend={HTML5Backend}>
                            <div className="rounded-md overflow-hidden border mt-4 bg-card">
                              {filteredTasks.map((task, index) => (
                                <div key={task.id} className="border-b last:border-0">
                                  <DraggableTaskItem
                                    task={task}
                                    index={index}
                                    onToggleComplete={toggleComplete}
                                    onDelete={deleteTask}
                                    onEdit={editTask}
                                    onMoveTask={moveTask}
                                  />
                                </div>
                              ))}
                            </div>
                          </DndProvider>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="upcoming" className="space-y-1">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center p-8 bg-muted/20 rounded-lg mt-4">
                            <Check className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No upcoming tasks</p>
                            <p className="text-muted-foreground text-sm">Your schedule is clear ahead</p>
                          </div>
                        ) : (
                          <DndProvider backend={HTML5Backend}>
                            <div className="rounded-md overflow-hidden border mt-4 bg-card">
                              {filteredTasks.map((task, index) => (
                                <div key={task.id} className="border-b last:border-0">
                                  <DraggableTaskItem
                                    task={task}
                                    index={index}
                                    onToggleComplete={toggleComplete}
                                    onDelete={deleteTask}
                                    onEdit={editTask}
                                    onMoveTask={moveTask}
                                  />
                                </div>
                              ))}
                            </div>
                          </DndProvider>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="completed" className="space-y-1">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center p-8 bg-muted/20 rounded-lg mt-4">
                            <Check className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No completed tasks</p>
                            <p className="text-muted-foreground text-sm">Tasks you complete will appear here</p>
                          </div>
                        ) : (
                          <DndProvider backend={HTML5Backend}>
                            <div className="rounded-md overflow-hidden border mt-4 bg-card">
                              {filteredTasks.map((task, index) => (
                                <div key={task.id} className="border-b last:border-0">
                                  <DraggableTaskItem
                                    task={task}
                                    index={index}
                                    onToggleComplete={toggleComplete}
                                    onDelete={deleteTask}
                                    onEdit={editTask}
                                    onMoveTask={moveTask}
                                  />
                                </div>
                              ))}
                            </div>
                          </DndProvider>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t p-4">
                    <div className="flex w-full flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <Input 
                          placeholder="Add new task..." 
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTask();
                          }}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline"
                              className={cn(
                                "px-3 h-10 flex-1 sm:flex-none", 
                                priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                                priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              )}
                            >
                              {priority} priority
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-2 w-48">
                            <div className="space-y-2">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                className={cn(
                                  "w-full justify-start", 
                                  priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""
                                )}
                                onClick={() => setPriority("low")}
                              >
                                Low priority
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                className={cn(
                                  "w-full justify-start", 
                                  priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""
                                )}
                                onClick={() => setPriority("medium")}
                              >
                                Medium priority
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                className={cn(
                                  "w-full justify-start", 
                                  priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""
                                )}
                                onClick={() => setPriority("high")}
                              >
                                High priority
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <Button onClick={addTask} className="flex-1 sm:flex-none">
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="hidden md:block">
                <Card className="shadow-md h-full">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Calendar
                    </CardTitle>
                    <CardDescription>
                      View and schedule your tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="border rounded-lg p-3 bg-muted/10">
                      <Calendar 
                        mode="single" 
                        selected={selectedDate} 
                        onSelect={setSelectedDate}
                        className="mx-auto"
                      />
                    </div>
                    
                    {selectedDate && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-sm">{format(selectedDate, "MMMM d, yyyy")}</h3>
                          <Badge variant="outline" className={cn(
                            isSameDay(selectedDate, new Date()) ? "bg-primary/10 border-primary/30 text-primary" : ""
                          )}>
                            {isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "EEEE")}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 h-[500px] overflow-hidden rounded-xl border">
                          <div
                            className="p-4 h-full overflow-y-auto"
                            style={{ transformOrigin: "top" }}
                          >
                            <div className="space-y-3">
                              {tasksByDate.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                  No tasks for {format(selectedDate!, "MMMM d, yyyy")}
                                </div>
                              ) : (
                                tasksByDate.map((task) => (
                                  <div 
                                    key={task.id}
                                    className="flex items-center gap-2 p-2 rounded border"
                                  >
                                    <Checkbox 
                                      checked={task.completed} 
                                      onCheckedChange={() => toggleComplete(task.id)}
                                    />
                                    <div className={cn("flex-1", task.completed && "line-through text-muted-foreground")}>
                                      {task.title}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                                      ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`
                                    }>
                                      {task.priority}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
