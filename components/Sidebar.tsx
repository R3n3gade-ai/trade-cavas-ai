"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2, LineChart, PieChart, TrendingUp,
  Settings, Brain, Zap, Layers, Activity,
  Users, BookOpen, Calendar, Search
} from "lucide-react";
import { useDashboardStore } from "../utils/store";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen } = useDashboardStore();

  const navItems = [
    {
      name: "Trade Studio",
      path: "/ted-ai",
      icon: <Brain className="h-5 w-5" />
    },
    {
      name: "Charts",
      path: "/charts",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      name: "Options",
      path: "/options",
      icon: <Activity className="h-5 w-5" />
    },
    {
      name: "Dark Pool",
      path: "/dark-pool",
      icon: <Layers className="h-5 w-5" />
    },
    {
      name: "Canvas",
      path: "/canvas",
      icon: <PieChart className="h-5 w-5" />
    },
    {
      name: "Social",
      path: "/social",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Education",
      path: "/personal-education",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      name: "Screeners",
      path: "/screeners",
      icon: <Search className="h-5 w-5" />
    },
  ];

  return (
    <aside
      className={`border-r border-white/10 h-screen transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      } flex flex-col`}
      style={{ backgroundColor: 'var(--container-color)' }}
    >
      {/* Logo */}
      <div className="h-16 border-b border-white/10 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {sidebarOpen && (
            <span className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>TradeCanvas</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-card/80"
                }`}
                style={{ color: location.pathname === item.path ? 'var(--primary-color, #3b82f6)' : 'var(--text-color)' }}
              >
                <span style={{ color: location.pathname === item.path ? 'var(--primary-color, #3b82f6)' : 'var(--text-color)' }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card/80 transition-colors"
          style={{ color: 'var(--text-color)' }}
        >
          <Settings className="h-5 w-5" style={{ color: 'var(--text-color)' }} />
          {sidebarOpen && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
