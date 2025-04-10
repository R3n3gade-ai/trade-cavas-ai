import React from 'react';
import { useDarkPoolStore } from '../utils/darkPoolStore';

export const DarkPoolHeatmap: React.FC = () => {
  const { darkPoolHeatmap, isLoading } = useDarkPoolStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!darkPoolHeatmap) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No dark pool heatmap data available.
      </div>
    );
  }
  
  // Sort heatmap data by price (descending)
  const sortedHeatmap = [...darkPoolHeatmap.heatmap].sort((a, b) => 
    parseFloat(b.price) - parseFloat(a.price)
  );
  
  // Function to get color based on intensity
  const getHeatmapColor = (intensity: number) => {
    // Green to red gradient
    if (intensity < 20) {
      return 'bg-green-900/20';
    } else if (intensity < 40) {
      return 'bg-green-700/40';
    } else if (intensity < 60) {
      return 'bg-yellow-700/60';
    } else if (intensity < 80) {
      return 'bg-orange-700/70';
    } else {
      return 'bg-red-700/80';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-background/40 p-4 border-b border-white/10">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{darkPoolHeatmap.ticker}</span>
            <span className="text-2xl font-bold">Price Heatmap</span>
          </div>
          <div className="ml-auto">
            <span className="text-sm text-muted-foreground">Date: {darkPoolHeatmap.date}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Volume Concentration by Price</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-900/20"></div>
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-yellow-700/60"></div>
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-700/80"></div>
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This heatmap shows the concentration of dark pool volume at different price levels.
            Darker colors indicate higher volume concentration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sortedHeatmap.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-md border border-white/5 ${getHeatmapColor(item.intensity)}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">${item.price}</span>
                <span className="text-sm text-muted-foreground">{item.volume}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Understanding the Heatmap</h3>
          <div className="bg-card rounded-lg p-5 border border-white/10">
            <div className="space-y-4 text-sm">
              <p>
                The dark pool heatmap visualizes the concentration of institutional trading activity at specific price levels.
                This can help identify potential support and resistance zones based on where large players are positioning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Support Levels</h4>
                  <p className="text-muted-foreground">
                    High volume concentration at prices below the current market price may indicate institutional support levels.
                    These are prices where large buyers may step in.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Resistance Levels</h4>
                  <p className="text-muted-foreground">
                    High volume concentration at prices above the current market price may indicate institutional resistance levels.
                    These are prices where large sellers may become active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
