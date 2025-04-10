import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useDarkPoolStore } from '../utils/darkPoolStore';

export const DarkPoolFilters: React.FC = () => {
  const { 
    searchTerm,
    setSearchTerm,
    showDarkPool,
    setShowDarkPool,
    showBlockTrades,
    setShowBlockTrades,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    minShares,
    setMinShares,
    maxShares,
    setMaxShares,
    lookbackDays,
    setLookbackDays,
    selectedTicker,
    setSelectedTicker,
    fetchDarkPoolTrades,
    fetchPriceLevels,
    fetchDarkPoolSummary,
    fetchDarkPoolHeatmap,
    fetchAllData,
    isLoading,
    lastUpdated
  } = useDarkPoolStore();
  
  // Local state for form values
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localMinValue, setLocalMinValue] = useState(minValue.toString());
  const [localMaxValue, setLocalMaxValue] = useState(maxValue.toString());
  const [localMinShares, setLocalMinShares] = useState(minShares.toString());
  const [localMaxShares, setLocalMaxShares] = useState(maxShares.toString());
  const [localLookbackDays, setLocalLookbackDays] = useState(lookbackDays.toString());
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };
  
  // Handle filter apply
  const handleApplyFilters = () => {
    setMinValue(parseInt(localMinValue) || 0);
    setMaxValue(parseInt(localMaxValue) || 0);
    setMinShares(parseInt(localMinShares) || 0);
    setMaxShares(parseInt(localMaxShares) || 0);
    setLookbackDays(parseInt(localLookbackDays) || 7);
    fetchDarkPoolTrades();
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchAllData();
  };
  
  return (
    <div className="flex flex-col">
      {/* Search and Refresh */}
      <div className="p-4 bg-background/40 border-b border-white/10">
        <div className="flex items-center justify-between">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
            />
          </form>
          
          <div className="flex items-center ml-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {/* Trade Type Filters */}
      <div className="p-4 bg-background/40 border-b border-white/10">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">Type:</div>
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDarkPool}
                  onChange={(e) => setShowDarkPool(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className="ml-1.5 text-xs">Dark Pool</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBlockTrades}
                  onChange={(e) => setShowBlockTrades(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className="ml-1.5 text-xs">Block Trades</span>
              </label>
            </div>
          </div>
          
          {/* Value Range Filter */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">Value ($):</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={localMinValue || ''}
                onChange={(e) => setLocalMinValue(e.target.value)}
                className="w-16 h-7 px-2 py-1 text-xs rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={localMaxValue || ''}
                onChange={(e) => setLocalMaxValue(e.target.value)}
                className="w-16 h-7 px-2 py-1 text-xs rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          {/* Shares Range Filter */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">Shares:</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={localMinShares || ''}
                onChange={(e) => setLocalMinShares(e.target.value)}
                className="w-16 h-7 px-2 py-1 text-xs rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={localMaxShares || ''}
                onChange={(e) => setLocalMaxShares(e.target.value)}
                className="w-16 h-7 px-2 py-1 text-xs rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          {/* Lookback Period Filter */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">Lookback:</div>
            <select
              value={localLookbackDays}
              onChange={(e) => setLocalLookbackDays(e.target.value)}
              className="h-7 px-2 py-1 text-xs rounded-md bg-card border border-white/10 focus:outline-none focus:border-primary transition-colors"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>
        
        <div className="flex mt-4 gap-2">
          <button
            onClick={handleApplyFilters}
            className="h-7 px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
          
          {/* ALL Tickers Button */}
          <button
            onClick={() => {
              setSelectedTicker("ALL");
              fetchAllData();
            }}
            className={`h-7 px-3 py-1 text-xs rounded-md transition-colors ${selectedTicker === "ALL" ? 'bg-green-600 text-white' : 'bg-background/50 border border-white/10 hover:bg-background/80'}`}
          >
            ALL
          </button>
          
          {/* Popular Tickers */}
          {['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'].map(ticker => (
            <button
              key={ticker}
              onClick={() => {
                setSelectedTicker(ticker);
                fetchAllData();
              }}
              className={`h-7 px-3 py-1 text-xs rounded-md transition-colors ${selectedTicker === ticker ? 'bg-primary text-white' : 'bg-background/50 border border-white/10 hover:bg-background/80'}`}
            >
              {ticker}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
