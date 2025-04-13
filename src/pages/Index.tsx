
import { useEffect } from "react";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import { initDemoTasks } from "@/services/taskService";

const Index = () => {
  useEffect(() => {
    // Initialize demo tasks on first load
    initDemoTasks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        <TaskList />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Task Mate | Advanced To-Do Application
        </div>
      </footer>
    </div>
  );
};

export default Index;
