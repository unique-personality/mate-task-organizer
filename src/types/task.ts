
export type TaskCategory = 
  | "work" 
  | "personal" 
  | "shopping" 
  | "health" 
  | "education" 
  | "finance" 
  | "other";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string; // ISO date string
  category: TaskCategory;
  createdAt: string; // ISO date string
}

export interface NewTask {
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
}
