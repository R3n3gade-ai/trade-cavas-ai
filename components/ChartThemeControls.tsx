import React from 'react';
import { useTickerStore } from '../utils/tickerStore';

const ChartThemeControls: React.FC = () => {
  const { 
    showGrid, 
    setShowGrid,
    candleStyle,
    setCandleStyle
  } = useTickerStore();

  return (
    <div className="flex items-center space-x-4">
      {/* Grid Toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`px-3 py-1.5 rounded-md border ${showGrid ? 'bg-primary border-primary' : 'bg-card border-white/10'}`}
      >
        Grid: {showGrid ? 'ON' : 'OFF'}
      </button>
      
      {/* Candle Style Selector */}
      <div className="relative">
        <select
          value={candleStyle}
          onChange={(e) => setCandleStyle(e.target.value as 'default' | 'hollow' | 'colored')}
          className="px-3 py-1.5 rounded-md border border-white/10 bg-card appearance-none pr-8"
        >
          <option value="default">Default Candles</option>
          <option value="hollow">Hollow Candles</option>
          <option value="colored">Colored Candles</option>
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChartThemeControls;
