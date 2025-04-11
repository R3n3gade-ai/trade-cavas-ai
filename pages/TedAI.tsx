"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain, History, HelpCircle, Settings, RefreshCw
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Import the GeminiStudio component and its styles
import GeminiStudio from '../components/GeminiStudio';
import '../styles/gemini-studio.css';
import { DashboardLayout } from "../components/DashboardLayout";

export default function TedAI() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Trade Studio">
      {/* Notifications */}
      <Toaster position="top-center" richColors />

      {/* Header Actions */}
      <div className="flex items-center space-x-2 absolute top-4 right-6">
        <button
          className="p-2 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          title="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          title="History"
        >
          <History className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Gemini Studio Component */}
      <div className="flex-1 overflow-hidden p-4 h-full">
        <GeminiStudio className="h-full" />
      </div>
    </DashboardLayout>
  );
}