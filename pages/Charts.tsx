import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

const Charts: React.FC = () => {
  // Chart container reference
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Chart state
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [period, setPeriod] = useState('15m');
  const [showIndicatorsDropdown, setShowIndicatorsDropdown] = useState(false);
  const indicatorsDropdownRef = useRef<HTMLDivElement>(null);

  // Available periods
  const periods = [
    { text: '1m', value: '1m' },
    { text: '5m', value: '5m' },
    { text: '15m', value: '15m' },
    { text: '30m', value: '30m' },
    { text: '1h', value: '1h' },
    { text: '4h', value: '4h' },
    { text: '1d', value: '1d' },
    { text: '1w', value: '1w' },
  ];

  // Available indicators
  const indicators = [
    { name: 'MA', series: 'price', params: [5, 10, 30] },
    { name: 'EMA', series: 'price', params: [5, 10, 30] },
    { name: 'BOLL', series: 'price', params: [20, 2] },
    { name: 'SAR', series: 'price', params: [2, 2, 20] },
    { name: 'VOL', series: 'volume', params: [5, 10, 20] },
    { name: 'MACD', series: 'indicator', params: [12, 26, 9] },
    { name: 'KDJ', series: 'indicator', params: [9, 3, 3] },
    { name: 'RSI', series: 'indicator', params: [6, 12, 24] },
    { name: 'WR', series: 'indicator', params: [6, 10, 14] },
    { name: 'CCI', series: 'indicator', params: [13, 21, 34] },
    { name: 'CR', series: 'indicator', params: [10, 20, 40, 60] },
  ];

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
      indicators.forEach(indicator => {
        const isNewPane = indicator.series === 'indicator' || indicator.name === 'VOL';
        if (indicator.name === 'MA' || indicator.name === 'VOL') {
          chartRef.current.createIndicator(indicator.name, isNewPane);
        }
      });

      // Add crosshair move event listener to update OHLCV info
      chartRef.current.subscribeAction('crosshair', ({ kLineData }) => {
        if (kLineData) {
          const { timestamp, open, high, low, close, volume } = kLineData;
          console.log(`O: ${open.toFixed(2)} H: ${high.toFixed(2)} L: ${low.toFixed(2)} C: ${close.toFixed(2)} V: ${volume.toFixed(0)}`);
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

  // Handle period change
  useEffect(() => {
    if (chartRef.current) {
      // In a real app, you would fetch new data for this period
      console.log(`Period changed to ${period}`);
      // For now, we'll just regenerate sample data
      const sampleData = generateSampleData();
      chartRef.current.applyNewData(sampleData);
    }
  }, [period]);

  // Handle click outside to close indicators dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (indicatorsDropdownRef.current && !indicatorsDropdownRef.current.contains(event.target as Node)) {
        setShowIndicatorsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle adding an indicator
  const handleAddIndicator = (indicatorName: string) => {
    if (chartRef.current) {
      const indicator = indicators.find(ind => ind.name === indicatorName);
      if (indicator) {
        const isNewPane = indicator.series === 'indicator' || indicator.name === 'VOL';
        chartRef.current.createIndicator(indicator.name, isNewPane);
      }
    }
  };

  // Handle removing an indicator
  const handleRemoveIndicator = (indicatorName: string) => {
    if (chartRef.current) {
      chartRef.current.removeIndicator(indicatorName);
    }
  };

  // Handle changing chart type
  const handleChangeChartType = (type: string) => {
    if (chartRef.current) {
      chartRef.current.setStyles({
        candle: {
          type,
        },
      });
    }
  };

  // Handle selecting a drawing tool
  const handleSelectDrawingTool = (tool: string) => {
    if (chartRef.current) {
      // In a real implementation, you would activate the drawing tool
      console.log(`Selected drawing tool: ${tool}`);
    }
  };

  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="flex flex-col h-full w-full">
        {/* Top Toolbar */}
        <div className="h-12 border-b border-white/10 flex items-center px-4">
          <div className="flex-1 flex items-center space-x-4">
            <div className="font-semibold">{symbol}</div>
            <div className="text-sm text-muted-foreground">{period}</div>

            {/* Period Selection */}
            <div className="flex items-center space-x-1">
              {periods.map((p) => (
                <button
                  key={p.value}
                  className={`px-2 py-1 text-xs rounded ${period === p.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/50 hover:bg-card border border-white/10'}`}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.text}
                </button>
              ))}
            </div>

            {/* Indicators Dropdown */}
            <div className="relative" ref={indicatorsDropdownRef}>
              <button
                className="px-2 py-1 text-xs rounded bg-card/50 hover:bg-card border border-white/10 flex items-center"
                onClick={() => setShowIndicatorsDropdown(!showIndicatorsDropdown)}
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

              {/* Indicators Dropdown Menu */}
              {showIndicatorsDropdown && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-card border border-white/10 rounded-md shadow-lg py-1 z-10">
                  <div className="px-3 py-2 text-xs font-semibold border-b border-white/10">Main Chart</div>
                  {indicators
                    .filter(ind => ind.series === 'price')
                    .map(indicator => (
                      <button
                        key={indicator.name}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-card/80"
                        onClick={() => {
                          handleAddIndicator(indicator.name);
                          setShowIndicatorsDropdown(false);
                        }}
                      >
                        {indicator.name}
                      </button>
                    ))}
                  <div className="px-3 py-2 text-xs font-semibold border-b border-white/10 mt-1">Separate Window</div>
                  {indicators
                    .filter(ind => ind.series === 'indicator' || ind.name === 'VOL')
                    .map(indicator => (
                      <button
                        key={indicator.name}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-card/80"
                        onClick={() => {
                          handleAddIndicator(indicator.name);
                          setShowIndicatorsDropdown(false);
                        }}
                      >
                        {indicator.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chart Area with Left Sidebar */}
        <div className="flex-1 flex">
          {/* Left Toolbar - Drawing Tools */}
          <div className="w-12 border-r border-white/10 flex flex-col items-center py-2 space-y-2">
            {/* Line Tool */}
            <button
              className="p-2 rounded hover:bg-card/50"
              onClick={() => handleSelectDrawingTool('line')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
              </svg>
            </button>

            {/* Horizontal Line Tool */}
            <button
              className="p-2 rounded hover:bg-card/50"
              onClick={() => handleSelectDrawingTool('horizontal')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18"></path>
              </svg>
            </button>

            {/* Rectangle Tool */}
            <button
              className="p-2 rounded hover:bg-card/50"
              onClick={() => handleSelectDrawingTool('rect')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>
          </div>

          {/* Chart */}
          <div className="flex-1" ref={chartContainerRef}></div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-10 border-t border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1">
              {/* Candle Chart */}
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => handleChangeChartType('candle_solid')}
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

              {/* Line Chart */}
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => handleChangeChartType('line')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="m3 15 5-5 4 4 5-5 4 4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Charts;
