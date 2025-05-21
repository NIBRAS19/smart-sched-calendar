import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ListTodo, Clock, Star, Tag, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getStorageItem } from "@/services/localStorage";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  type: 'task' | 'event';
  title: string;
  date?: Date;
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  tags?: string[];
  completed?: boolean;
}

export function SearchDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchItems, setSearchItems] = React.useState<SearchItem[]>([]);

  // Load tasks from localStorage
  React.useEffect(() => {
    try {
      const storedTasks = getStorageItem('tasks');
      if (storedTasks && Array.isArray(storedTasks)) {
        const tasks = storedTasks.map(task => ({
          id: task.id,
          type: 'task' as const,
          title: task.title,
          date: task.dueDate ? new Date(task.dueDate) : undefined,
          priority: task.priority,
          tags: task.tags,
          completed: task.completed
        }));
        setSearchItems(tasks);
      }
    } catch (error) {
      console.error('Error loading tasks for search:', error);
    }
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return searchItems;
    
    const query = searchQuery.toLowerCase();
    return searchItems.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
      return matchesTitle || matchesTags;
    });
  }, [searchItems, searchQuery]);

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'task') {
      navigate('/tasks');
    } else {
      navigate('/calendar');
    }
    setOpen(false);
  };

  // Close on escape
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(true)} 
        className="rounded-full"
      >
        <Search size={20} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 max-w-3xl">
          <Command className="rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Search tasks, events, tags..." 
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No results found.</p>
                <p className="text-xs text-muted-foreground mt-1">Try searching with different keywords</p>
              </CommandEmpty>
              
              {filteredItems.length > 0 && (
                <>
              <CommandGroup heading="Tasks">
                    {filteredItems
                      .filter(item => item.type === 'task')
                      .map(item => (
                  <CommandItem 
                    key={item.id} 
                    onSelect={() => handleSelect(item)}
                          className="flex items-start gap-2 p-2 cursor-pointer"
                  >
                          <div className={cn(
                            "h-4 w-4 mt-0.5 shrink-0 rounded-full flex items-center justify-center",
                            item.completed ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                            {item.completed && <Check size={12} />}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-sm",
                                item.completed && "line-through text-muted-foreground"
                              )}>
                                {item.title}
                              </span>
                              {item.priority === 'high' && (
                                <Star size={12} className="text-yellow-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {item.date && (
                                <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                                  {format(item.date, "MMM d, h:mm a")}
                          </span>
                        )}
                              {item.tags && item.tags.length > 0 && (
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {item.tags.join(", ")}
                      </span>
                              )}
                            </div>
                    </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
                  
                  {filteredItems.some(item => item.type === 'event') && (
                    <>
                      <CommandSeparator />
              <CommandGroup heading="Events">
                        {filteredItems
                          .filter(item => item.type === 'event')
                          .map(item => (
                  <CommandItem 
                    key={item.id} 
                    onSelect={() => handleSelect(item)}
                              className="flex items-start gap-2 p-2 cursor-pointer"
                  >
                              <Calendar className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm">{item.title}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.date && (
                                    <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                                      {format(item.date, "MMM d, h:mm a")}
                                    </span>
                                  )}
                        {item.location && (
                                    <span className="text-xs text-muted-foreground">
                            @ {item.location}
                          </span>
                        )}
                                </div>
                    </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
                    </>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
