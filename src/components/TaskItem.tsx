
import React from "react";
import { Task } from "../types/task";
import { toggleTaskStatus, deleteTask } from "../services/taskService";
import { CheckCircle, Circle, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onTaskChange: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onTaskChange }) => {
  const { toast } = useToast();
  const dueDate = new Date(task.dueDate);
  const isOverdue = !task.completed && new Date() > dueDate;
  
  const formatDueDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };
  
  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
    onTaskChange();
    
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed",
      description: task.title,
      duration: 2000,
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onTaskChange();
    
    toast({
      title: "Task deleted",
      description: task.title,
      variant: "destructive",
      duration: 2000,
    });
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "work": return "bg-blue-100 text-blue-800";
      case "personal": return "bg-purple-100 text-purple-800";
      case "shopping": return "bg-green-100 text-green-800";
      case "health": return "bg-red-100 text-red-800";
      case "education": return "bg-yellow-100 text-yellow-800";
      case "finance": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border transition-all duration-200",
        task.completed ? "border-green-200 bg-green-50" : "border-gray-200",
        isOverdue && !task.completed ? "border-red-200 bg-red-50" : ""
      )}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={handleToggleStatus} 
          className="mt-1 text-gray-500 hover:text-primary transition-colors"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-secondary" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <h3 
              className={cn(
                "font-medium text-lg transition-opacity",
                task.completed ? "line-through opacity-70" : ""
              )}
            >
              {task.title}
            </h3>
            <span className={cn(
              "text-xs font-medium rounded-full px-2 py-1",
              getCategoryColor(task.category)
            )}>
              {task.category}
            </span>
          </div>
          
          <p className={cn(
            "text-gray-600 mt-1 transition-opacity",
            task.completed ? "opacity-70" : ""
          )}>
            {task.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <div className={cn(
              "flex items-center text-sm",
              isOverdue ? "text-red-600" : "text-gray-500"
            )}>
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {isOverdue ? "Overdue: " : "Due: "}
                {formatDueDate(dueDate)}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(task)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
