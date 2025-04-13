
import React from "react";
import { CheckSquare } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">Task Mate</h1>
          </div>
          <div className="text-sm text-gray-600">
            Your personal task manager
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
