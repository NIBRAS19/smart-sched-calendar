import React, { useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Star, Edit2, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

interface DraggableTaskItemProps {
  task: Task;
  index: number;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updatedTask: Task) => void;
  onMoveTask: (dragIndex: number, hoverIndex: number) => void;
}

export default function DraggableTaskItem({ 
  task, 
  index,
  onToggleComplete, 
  onDelete, 
  onEdit,
  onMoveTask
}: DraggableTaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Drag and drop functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [index]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMoveTask(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [index, onMoveTask]);
  
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
  
  // Render view mode
  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={cn(
        "group relative",
        expanded ? "bg-muted/40 rounded-lg overflow-hidden" : "",
        isDragging ? "opacity-50" : "",
        isOver ? "bg-muted/50" : ""
      )}
      style={{ cursor: 'grab' }}
    >
      {/* Main task row */}
      <div className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/40",
        task.completed && "opacity-70",
        expanded && "rounded-b-none border-b border-border/50"
      )}>
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggleComplete(task.id)}
            className={cn(
              "transition-all",
              task.priority === "high" ? "text-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" :
              task.priority === "medium" ? "text-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" :
              "text-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0" onClick={() => task.description && setExpanded(!expanded)}>
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
              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7" 
              onClick={() => onEdit && onEdit(task.id, task)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7" 
            onClick={() => onDelete(task.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded task details */}
      {expanded && task.description && (
        <div className="p-3 pt-2 text-sm text-muted-foreground">
          <p className="whitespace-pre-line">{task.description}</p>
        </div>
      )}
    </div>
  );
}
