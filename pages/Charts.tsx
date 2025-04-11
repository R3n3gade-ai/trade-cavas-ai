import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

// Define types for our chart state
interface ChartState {
  symbol: string;
  interval: string;
  indicators: string[];
  chartType: 'candle_solid' | 'candle_stroke' | 'candle_up_stroke_down_solid' | 'candle_down_stroke_up_solid' | 'ohlc' | 'area' | 'line';
  selectedDrawingTool: string | null;
}

const Charts: React.FC = () => {
  // Chart container reference
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Chart state
  const [chartState, setChartState] = useState<ChartState>({
    symbol: 'BTC/USDT',
    interval: '15m',
    indicators: ['MA', 'VOL'],
    chartType: 'candle_solid',
    selectedDrawingTool: null
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
          type: chartState.chartType,
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
        // Create indicators with proper pane placement
        if (indicator === 'VOL') {
          // Volume is typically in a separate pane
          chartRef.current.createIndicator(indicator, true);
        } else if (['MACD', 'RSI', 'KDJ', 'BOLL', 'WR'].includes(indicator)) {
          // These indicators are typically in separate panes
          chartRef.current.createIndicator(indicator, true);
        } else {
          // Other indicators like MA are typically overlaid on the main chart
          chartRef.current.createIndicator(indicator, false);
        }
      });

      // Add crosshair move event listener to update OHLCV info
      chartRef.current.subscribeAction('crosshair', ({ kLineData }) => {
        if (kLineData) {
          const { timestamp, open, high, low, close, volume } = kLineData;
          const ohlcvInfo = document.getElementById('chart-ohlcv-info');
          if (ohlcvInfo) {
            ohlcvInfo.textContent = `O: ${open.toFixed(2)} H: ${high.toFixed(2)} L: ${low.toFixed(2)} C: ${close.toFixed(2)} V: ${volume.toFixed(0)}`;
          }
        }
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
      // Determine if indicator should be in a separate pane
      const isNewPane = indicatorType === 'VOL' ||
                        ['MACD', 'RSI', 'KDJ', 'BOLL', 'WR'].includes(indicatorType);

      // Create the indicator
      chartRef.current.createIndicator(indicatorType, isNewPane);

      // Update state
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

  // Handle changing chart type
  const changeChartType = (type: ChartState['chartType']) => {
    if (chartRef.current) {
      chartRef.current.setStyles({
        candle: {
          type,
        },
      });
      setChartState(prev => ({
        ...prev,
        chartType: type
      }));
    }
  };

  // Handle selecting a drawing tool
  const selectDrawingTool = (tool: string) => {
    if (chartRef.current) {
      // In a real implementation, you would activate the drawing tool
      // For now, we'll just update the state
      setChartState(prev => ({
        ...prev,
        selectedDrawingTool: prev.selectedDrawingTool === tool ? null : tool
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

            {/* Indicators Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="px-2 py-1 text-xs rounded bg-card/50 hover:bg-card border border-white/10 flex items-center"
                onClick={() => setShowIndicatorDropdown(!showIndicatorDropdown)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h6"></path>
                  <path d="M22 12h-6"></path>
                  <path d="M12 2v2"></path>
                  <path d="M12 8v2"></path>
                  <path d="M12 14v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M18 8v8"></path>
                  <path d="M6 8v8"></path>
                </svg>
                Indicators
              </button>

              {/* Indicator Dropdown */}
              {showIndicatorDropdown && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-card border border-white/10 rounded-md shadow-lg py-1 z-10">
                  {['BOLL', 'RSI', 'MACD', 'KDJ', 'VOL', 'MA', 'EMA', 'BIAS', 'BRAR', 'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV', 'SAR', 'AO', 'ROC', 'PVT', 'AVP']
                    .filter(ind => !chartState.indicators.includes(ind))
                    .map(indicator => (
                      <button
                        key={indicator}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-card/80"
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

        {/* Main Chart Area with Left and Right Sidebars */}
        <div className="flex-1 flex">
          {/* Left Toolbar - Drawing Tools */}
          <div className="w-12 border-r border-white/10 flex flex-col items-center py-2 space-y-2">
            {/* Line Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'line' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('line')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
              </svg>
            </button>

            {/* Ray Line Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'ray' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('ray')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3l18 18"></path>
              </svg>
            </button>

            {/* Horizontal Line Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'horizontal' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('horizontal')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18"></path>
              </svg>
            </button>

            {/* Rectangle Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'rect' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('rect')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>

            {/* Circle Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'circle' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('circle')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </button>

            {/* Text Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'text' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('text')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7V4h16v3"></path>
                <path d="M9 20h6"></path>
                <path d="M12 4v16"></path>
              </svg>
            </button>

            {/* Fibonacci Tool */}
            <button
              className={`p-2 rounded ${chartState.selectedDrawingTool === 'fibonacci' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('fibonacci')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m3 9 18-6"></path>
              </svg>
            </button>

            {/* Eraser Tool */}
            <button
              className={`p-2 rounded mt-auto ${chartState.selectedDrawingTool === 'eraser' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
              onClick={() => selectDrawingTool('eraser')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
                <path d="M22 21H7"></path>
                <path d="m5 11 9 9"></path>
              </svg>
            </button>
          </div>

          {/* Chart */}
          <div className="flex-1" ref={chartContainerRef}></div>

          {/* No right sidebar - indicators are displayed directly on the chart */}
        </div>

        {/* Bottom Toolbar */}
        <div className="h-10 border-t border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1">
              {/* Candle Chart */}
              <button
                className={`p-1.5 rounded ${chartState.chartType === 'candle_solid' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
                onClick={() => changeChartType('candle_solid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5v4"></path>
                  <rect width="4" height="10" x="7" y="9" rx="1"></rect>
                  <path d="M9 19v2"></path>
                  <path d="M17 3v2"></path>
                  <rect width="4" height="14" x="15" y="5" rx="1"></rect>
                  <path d="M17 19v2"></path>
                </svg>
              </button>

              {/* OHLC Chart */}
              <button
                className={`p-1.5 rounded ${chartState.chartType === 'ohlc' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
                onClick={() => changeChartType('ohlc')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
              </button>

              {/* Line Chart */}
              <button
                className={`p-1.5 rounded ${chartState.chartType === 'line' ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
                onClick={() => changeChartType('line')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="m3 15 5-5 4 4 5-5 4 4"></path>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10"></div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => {
                  if (chartRef.current) {
                    chartRef.current.zoomAtCoordinate(0.5, { x: 0, y: 0 });
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  <path d="M15 10h-6"></path>
                </svg>
              </button>
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => {
                  if (chartRef.current) {
                    chartRef.current.zoomAtCoordinate(2, { x: 0, y: 0 });
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  <path d="M12 7v6"></path>
                  <path d="M9 10h6"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span id="chart-ohlcv-info">O: 0.00 H: 0.00 L: 0.00 C: 0.00 V: 0</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Charts;
