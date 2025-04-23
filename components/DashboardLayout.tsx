"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { Search, Bell, Settings, Menu, RefreshCw } from "lucide-react";
import { useDashboardStore } from "../utils/store";
import { useTickerStore } from "../utils/tickerStore";
import { UserMenuDropdown } from "./UserMenuDropdown";
import TickerSearch from "./TickerSearch";
import ChartControls from "./ChartControls";
import ChartSettingsButton from "./ChartSettingsButton";


interface Props {
  children: ReactNode;
  title?: string;
  showRefresh?: boolean;
}

export const DashboardLayout: React.FC<Props> = ({
  children,
  title,
  showRefresh = false
}) => {
  const { toggleSidebar, refreshData } = useDashboardStore();
  const { currentTicker, setCurrentTicker } = useTickerStore();
  const [showChartControls, setShowChartControls] = useState(false);

  // Check if we're on the charts page
  useEffect(() => {
    setShowChartControls(title === 'Charts');
  }, [title]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6" style={{ backgroundColor: 'var(--background-color)' }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-card transition-colors text-red-500 hover:text-red-400"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            {showRefresh && (
              <button
                onClick={() => refreshData()}
                className="p-2 rounded-md hover:bg-card transition-colors flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                title="Refresh market data"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-xs">Refresh</span>
              </button>
            )}
            {title && <h1 className="text-xl font-bold">{title}</h1>}
          </div>
          <div className="flex items-center space-x-4">
            {/* Chart Controls */}
            {showChartControls && (
              <div className="flex items-center space-x-4">
                <ChartControls />
                <ChartSettingsButton />
              </div>
            )}

            {/* Search */}
            <div className="relative w-64">
              {showChartControls ? (
                <TickerSearch
                  value={currentTicker}
                  onChange={setCurrentTicker}
                  label=""
                  placeholder="Enter ticker symbol..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--card)',
                      borderRadius: '0.375rem',
                      color: 'var(--text-color)',
                      height: '40px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary)',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary)',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                    }
                  }}
                />
              ) : (
                <>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full pl-10 pr-4 py-2 rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-card transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <UserMenuDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--background-color)', padding: title === 'Charts' ? 0 : '1.5rem' }}>
          {children}
        </main>
      </div>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
};
