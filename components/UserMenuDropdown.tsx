"use client";

import React from "react";
import { Link } from "react-router-dom";
import { 
  User, Settings, LogOut, Bell, 
  CreditCard, HelpCircle, Wallet
} from "lucide-react";

export const UserMenuDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-dropdown")) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative user-menu-dropdown">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-card transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium hidden md:inline-block">John Doe</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-white/10 rounded-md shadow-lg z-10">
          <div className="p-3 border-b border-white/10">
            <div className="font-medium">John Doe</div>
            <div className="text-xs text-muted-foreground">john.doe@example.com</div>
          </div>
          
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            
            <Link
              to="/notifications"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
            
            <Link
              to="/billing"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </Link>
            
            <Link
              to="/wallet"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </Link>
            
            <Link
              to="/help"
              className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </div>
          
          <div className="py-1 border-t border-white/10">
            <button
              className="flex w-full items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors text-red-500"
              onClick={() => {
                // Handle logout
                setIsOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;
