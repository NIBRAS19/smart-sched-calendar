export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  relatedEvent?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
} 