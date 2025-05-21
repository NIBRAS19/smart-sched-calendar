import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, Star, Edit2, Calendar as CalendarIcon, Clock, Save, Tag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  relatedEvent?: string;
  description?: string;
  tags?: string[];
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updatedTask: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Helper function to get status badge
  const getStatusBadge = () => {
    if (!task.dueDate) return null;
    
    if (task.completed) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
          Completed
        </span>
      );
    }
    
    if (isPast(task.dueDate) && !isToday(task.dueDate)) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
          Overdue
        </span>
      );
    }
    
    if (isToday(task.dueDate)) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
          Today
        </span>
      );
    }
    
    return null;
  };
  
  // Helper function to get priority indicator
  const getPriorityColor = (priority: string): string => {
    if (priority === "high") {
      return "var(--event-work)";
    } else if (priority === "medium") {
      return "var(--event-meeting)";
    } else {
      return "var(--event-personal)";
    }
  };

  // Handle save edited task
  const handleSaveEdit = () => {
    if (onEdit && editedTask.title.trim()) {
      onEdit(task.id, editedTask);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  // Add a new tag
  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    
    const currentTags = editedTask.tags || [];
    if (!currentTags.includes(tag)) {
      setEditedTask({
        ...editedTask,
        tags: [...currentTags, tag]
      });
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = editedTask.tags || [];
    setEditedTask({
      ...editedTask,
      tags: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  // Render edit mode
  if (isEditing) {
    return (
      <div className="p-3 sm:p-4 rounded-lg border border-border bg-background shadow-sm">
        <div className="space-y-3">
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder="Task title"
            className="font-medium"
          />
          
          <div className="flex flex-wrap gap-2 items-center mt-3">
            {/* Priority selector */}
            <Select
              value={editedTask.priority}
              onValueChange={(value: "low" | "medium" | "high") => 
                setEditedTask({ ...editedTask, priority: value })
              }
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {editedTask.dueDate ? format(editedTask.dueDate, "MMM d, yyyy") : "Set due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate}
                  onSelect={(date) => setEditedTask({ ...editedTask, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {/* Clear date button if date is set */}
            {editedTask.dueDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => setEditedTask({ ...editedTask, dueDate: undefined })}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear date
              </Button>
            )}
          </div>
          
          {/* Related event input */}
          <Input
            value={editedTask.relatedEvent || ""}
            onChange={(e) => setEditedTask({ ...editedTask, relatedEvent: e.target.value })}
            placeholder="Related event (optional)"
            className="h-8"
          />
          
          {/* Description textarea */}
          <Textarea
            value={editedTask.description || ""}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            placeholder="Add description (optional)"
            className="min-h-[80px] text-sm"
          />
          
          {/* Tags section */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Tags</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(editedTask.tags || []).map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button 
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a tag"
                className="h-8"
                id="tag-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8"
                onClick={() => {
                  const input = document.getElementById('tag-input') as HTMLInputElement;
                  if (input) {
                    handleAddTag(input.value);
                    input.value = '';
                  }
                }}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" className="h-9" onClick={handleCancelEdit}>Cancel</Button>
            <Button size="sm" className="h-9" onClick={handleSaveEdit} disabled={!editedTask.title.trim()}>
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render view mode
  return (
    <div className={cn(
      "group relative",
      expanded ? "bg-muted/40 rounded-lg overflow-hidden" : "",
      isMobile ? "touch-manipulation" : ""
    )}>
      {/* Main task row */}
      <div className={cn(
        "flex items-start gap-3 p-3 sm:p-4 rounded-lg transition-colors hover:bg-muted/40",
        task.completed && "opacity-70",
        expanded && "rounded-b-none border-b border-border/50"
      )}>
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggleComplete(task.id)}
            className={cn(
              "transition-all",
              isMobile ? "h-5 w-5" : "",
              task.priority === "high" ? "text-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" :
              task.priority === "medium" ? "text-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" :
              "text-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0" onClick={() => task.description && setExpanded(!expanded)} style={{ minHeight: isMobile ? '44px' : 'auto' }}>
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className={cn(
                "font-medium text-sm sm:text-base",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </span>
            
            {task.priority === "high" && (
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            )}
            
            {getStatusBadge()}
          </div>
          
          <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-1 gap-x-2 gap-y-1">
            {task.dueDate && (
              <span className="inline-flex items-center">
                <span 
                  className="size-2 mr-1 rounded-full" 
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                ></span>
                {format(task.dueDate, "MMM d, yyyy")}
              </span>
            )}
            
            {task.relatedEvent && (
              <span>
                {task.dueDate && "•"}
                <span className="ml-1">{task.relatedEvent}</span>
              </span>
            )}
            
            {/* Display tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 w-full">
                {task.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="px-2 py-0 h-5 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Expandable indicator */}
            {task.description && (
              <span className="ml-auto">
                <ChevronRight className={cn(
                  "h-3.5 w-3.5 transition-transform", 
                  expanded && "rotate-90"
                )} />
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isMobile ? "opacity-70" : "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isMobile ? "opacity-70" : "opacity-0 group-hover:opacity-100 transition-opacity"
            )}
            onClick={() => onDelete(task.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded task details */}
      {expanded && task.description && (
        <div className="p-3 sm:p-4 pt-2 text-sm text-muted-foreground">
          <p className="whitespace-pre-line">{task.description}</p>
        </div>
      )}
    </div>
  );
}
