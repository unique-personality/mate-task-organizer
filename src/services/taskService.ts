
import { Task, NewTask, TaskCategory } from "../types/task";

// In a real app, this would connect to your MongoDB backend
// For now, we'll use localStorage

const STORAGE_KEY = "taskmate_tasks";

// Generate a simple ID (in production, use UUID or similar)
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all tasks from storage
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

// Save tasks to storage
const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// Add a new task
export const addTask = (newTask: NewTask): Task => {
  const tasks = getTasks();
  
  const task: Task = {
    ...newTask,
    id: generateId(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  saveTasks([...tasks, task]);
  return task;
};

// Update a task
export const updateTask = (taskId: string, updatedTask: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return null;
  
  const task = tasks[taskIndex];
  const newTask = { ...task, ...updatedTask };
  
  tasks[taskIndex] = newTask;
  saveTasks(tasks);
  
  return newTask;
};

// Delete a task
export const deleteTask = (taskId: string): boolean => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

// Toggle task completion status
export const toggleTaskStatus = (taskId: string): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return null;
  
  const task = tasks[taskIndex];
  const updatedTask = { ...task, completed: !task.completed };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

// Search tasks
export const searchTasks = (query: string, tasks: Task[]): Task[] => {
  if (!query) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(
    task => 
      task.title.toLowerCase().includes(lowercaseQuery) || 
      task.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Filter tasks by category
export const filterTasksByCategory = (category: TaskCategory | "all", tasks: Task[]): Task[] => {
  if (category === "all") return tasks;
  
  return tasks.filter(task => task.category === category);
};

// Setup initial demo tasks if none exist
export const initDemoTasks = (): void => {
  if (getTasks().length === 0) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const demoTasks: Task[] = [
      {
        id: "demo1",
        title: "Complete Task Mate project",
        description: "Finish building the Task Mate web application",
        completed: false,
        dueDate: tomorrow.toISOString(),
        category: "work",
        createdAt: today.toISOString()
      },
      {
        id: "demo2",
        title: "Buy groceries",
        description: "Milk, eggs, bread, and vegetables",
        completed: true,
        dueDate: today.toISOString(),
        category: "shopping",
        createdAt: today.toISOString()
      },
      {
        id: "demo3",
        title: "Morning jog",
        description: "30 minutes of jogging in the park",
        completed: false,
        dueDate: tomorrow.toISOString(),
        category: "health",
        createdAt: today.toISOString()
      }
    ];
    
    saveTasks(demoTasks);
  }
};
