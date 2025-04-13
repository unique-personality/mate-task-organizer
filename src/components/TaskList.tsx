
import React, { useState, useEffect, useCallback } from "react";
import { Task, TaskCategory } from "../types/task";
import { addTask, getTasks, updateTask, searchTasks, filterTasksByCategory } from "../services/taskService";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { cn } from "@/lib/utils";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filtering and searching whenever dependencies change
  useEffect(() => {
    let result = tasks;
    
    // Apply search if there is a query
    if (searchQuery) {
      result = searchTasks(searchQuery, result);
    }
    
    // Apply category filter
    result = filterTasksByCategory(selectedCategory, result);
    
    // Sort tasks: incomplete first, then by due date
    result = [...result].sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, selectedCategory]);

  const loadTasks = useCallback(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, "id" | "completed" | "createdAt">) => {
    if (currentTask) {
      // Update existing task
      const updated = updateTask(currentTask.id, taskData);
      if (updated) {
        toast({
          title: "Task updated",
          description: "Your task has been successfully updated.",
          duration: 2000,
        });
      }
    } else {
      // Add new task
      addTask(taskData);
      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
        duration: 2000,
      });
    }
    
    loadTasks();
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "finance", label: "Finance" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as TaskCategory | "all")}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onTaskChange={loadTasks}
            />
          ))
        ) : (
          <div className={cn(
            "flex flex-col items-center justify-center text-center py-12 px-4",
            "border-2 border-dashed border-gray-200 rounded-lg"
          )}>
            <div className="text-gray-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            
            {searchQuery || selectedCategory !== "all" ? (
              <p className="text-gray-500 mb-4">
                Try changing your search or filter criteria
              </p>
            ) : (
              <p className="text-gray-500 mb-4">
                Get started by creating your first task
              </p>
            )}
            
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
        )}
      </div>
      
      <TaskForm
        task={currentTask}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskList;
