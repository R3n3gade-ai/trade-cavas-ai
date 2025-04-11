import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

// Define types for our chart state
interface ChartState {
  symbol: string;
  interval: string;
  indicators: string[];
}

const Charts: React.FC = () => {
  // Chart container reference
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Chart state
  const [chartState, setChartState] = useState<ChartState>({
    symbol: 'BTC/USDT',
    interval: '15m',
    indicators: ['MA', 'VOL']
  });

  // UI state
  const [showIndicatorDropdown, setShowIndicatorDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize chart when component mounts
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      // Create chart instance
      chartRef.current = klinecharts.init(chartContainerRef.current, {
        theme: 'dark',
        grid: {
          show: true,
          horizontal: {
            show: true,
            size: 1,
            color: 'rgba(255, 255, 255, 0.1)',
            style: 'solid',
          },
          vertical: {
            show: true,
            size: 1,
            color: 'rgba(255, 255, 255, 0.1)',
            style: 'solid',
          },
        },
        candle: {
          type: 'candle_solid',
          styles: {
            upColor: '#26A69A',
            downColor: '#EF5350',
            noChangeColor: '#888888',
          },
        },
      });

      // Generate sample data
      const sampleData = generateSampleData();
      chartRef.current.applyNewData(sampleData);

      // Add initial indicators
      chartState.indicators.forEach(indicator => {
        chartRef.current.createIndicator(indicator);
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  // Handle interval change
  useEffect(() => {
    if (chartRef.current) {
      // In a real app, you would fetch new data for this interval
      // For now, we'll just log the interval change
      console.log(`Interval changed to ${chartState.interval}`);
    }
  }, [chartState.interval]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIndicatorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle adding a new indicator
  const addIndicator = (indicatorType: string) => {
    if (chartRef.current && !chartState.indicators.includes(indicatorType)) {
      chartRef.current.createIndicator(indicatorType);
      setChartState(prev => ({
        ...prev,
        indicators: [...prev.indicators, indicatorType]
      }));
    }
  };

  // Handle removing an indicator
  const removeIndicator = (indicatorType: string) => {
    if (chartRef.current) {
      chartRef.current.removeIndicator(indicatorType);
      setChartState(prev => ({
        ...prev,
        indicators: prev.indicators.filter(i => i !== indicatorType)
      }));
    }
  };

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const baseTimestamp = new Date().getTime() - 365 * 24 * 60 * 60 * 1000; // 1 year ago
    const sampleData = [];
    let price = 200;

    for (let i = 0; i < 365; i++) {
      const timestamp = baseTimestamp + i * 24 * 60 * 60 * 1000;
      const randomChange = (Math.random() - 0.5) * 10;
      price += randomChange;

      const open = price;
      const close = price + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      const volume = Math.floor(Math.random() * 10000) + 1000;

      sampleData.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    return sampleData;
  };

  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="flex flex-col h-full w-full">
        {/* Top Toolbar */}
        <div className="h-12 border-b border-white/10 flex items-center px-4">
          <div className="flex-1 flex items-center space-x-4">
            <div className="font-semibold">{chartState.symbol}</div>
            <div className="text-sm text-muted-foreground">{chartState.interval}</div>

            {/* Period Selection */}
            <div className="flex items-center space-x-1">
              {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map((interval) => (
                <button
                  key={interval}
                  className={`px-2 py-1 text-xs rounded ${chartState.interval === interval
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/50 hover:bg-card border border-white/10'}`}
                  onClick={() => {
                    setChartState(prev => ({ ...prev, interval }));
                    // In a real app, you would fetch new data for this interval
                  }}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded bg-card/50 hover:bg-card border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h5"></path>
                <path d="M17 12h5"></path>
                <path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5Z"></path>
              </svg>
            </button>
            <button className="p-1.5 rounded bg-card/50 hover:bg-card border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
              </svg>
            </button>
            <button className="p-1.5 rounded bg-card/50 hover:bg-card border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
              </svg>
            </button>
            <button className="p-1.5 rounded bg-card/50 hover:bg-card border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Chart Area with Right Sidebar */}
        <div className="flex-1 flex">
          {/* Chart */}
          <div className="flex-1" ref={chartContainerRef}></div>

          {/* Right Sidebar with Indicator Controls */}
          <div className="w-64 border-l border-white/10 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4">Indicators</h3>

            {/* Indicator List */}
            <div className="space-y-3">
              {/* MA Indicator */}
              <div className="p-2 bg-card/50 border border-white/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">Moving Average</div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => {
                        // Toggle indicator visibility
                        if (chartRef.current) {
                          // In a real implementation, you would toggle visibility
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => removeIndicator('MA')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>MA(5)</div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>MA(10)</div>
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div>MA(30)</div>
                </div>
              </div>

              {/* MACD Indicator */}
              <div className="p-2 bg-card/50 border border-white/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">MACD</div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-card/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => removeIndicator('MACD')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>DIF(12,26)</div>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div>DEA(9)</div>
                </div>
              </div>

              {/* RSI Indicator */}
              <div className="p-2 bg-card/50 border border-white/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">RSI</div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-card/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => removeIndicator('RSI')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>RSI(14)</div>
                </div>
              </div>

              {/* Volume Indicator */}
              <div className="p-2 bg-card/50 border border-white/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">Volume</div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-card/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => removeIndicator('VOL')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>VOL</div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>MA(5)</div>
                </div>
              </div>
            </div>

            {/* Add Indicator Button and Dropdown */}
            <div className="relative mt-4" ref={dropdownRef}>
              <button
                className="w-full p-2 bg-primary text-primary-foreground rounded-md text-sm flex items-center justify-center"
                onClick={() => setShowIndicatorDropdown(!showIndicatorDropdown)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                Add Indicator
              </button>

              {/* Indicator Dropdown */}
              {showIndicatorDropdown && (
                <div className="absolute bottom-full mb-1 left-0 w-full bg-card border border-white/10 rounded-md shadow-lg py-1 z-10">
                  {['BOLL', 'RSI', 'MACD', 'KDJ', 'VOL', 'MA', 'EMA', 'BIAS', 'BRAR', 'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV', 'SAR', 'AO', 'ROC', 'PVT', 'AVP']
                    .filter(ind => !chartState.indicators.includes(ind))
                    .map(indicator => (
                      <button
                        key={indicator}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-card/80"
                        onClick={() => {
                          addIndicator(indicator);
                          setShowIndicatorDropdown(false);
                        }}
                      >
                        {indicator}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Charts;
