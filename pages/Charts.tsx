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

  // Drawing tools state
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string | null>(null);
  const [activeDrawingToolCategory, setActiveDrawingToolCategory] = useState<string | null>(null);
  const [showDrawingToolSubmenu, setShowDrawingToolSubmenu] = useState(false);
  const drawingToolSubmenuRef = useRef<HTMLDivElement>(null);

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

  // Drawing tool categories and tools
  const drawingToolCategories = [
    {
      id: 'line',
      name: 'Line',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
        </svg>
      ),
      tools: [
        { id: 'line', name: 'Line' },
        { id: 'ray', name: 'Ray' },
        { id: 'arrow', name: 'Arrow' },
        { id: 'horizontal_line', name: 'Horizontal Line' },
        { id: 'horizontal_ray', name: 'Horizontal Ray' },
        { id: 'vertical_line', name: 'Vertical Line' },
        { id: 'price_line', name: 'Price Line' },
      ],
    },
    {
      id: 'segment',
      name: 'Segment',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l6 6"></path>
          <path d="M15 15l6 6"></path>
        </svg>
      ),
      tools: [
        { id: 'segment', name: 'Segment' },
        { id: 'parallel_line', name: 'Parallel Line' },
        { id: 'price_channel', name: 'Price Channel' },
      ],
    },
    {
      id: 'rect',
      name: 'Rectangle',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      ),
      tools: [
        { id: 'rect', name: 'Rectangle' },
        { id: 'parallel_channel', name: 'Parallel Channel' },
      ],
    },
    {
      id: 'circle',
      name: 'Circle',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      ),
      tools: [
        { id: 'circle', name: 'Circle' },
        { id: 'arc', name: 'Arc' },
      ],
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m3 9 18-6"></path>
        </svg>
      ),
      tools: [
        { id: 'fibonacci_line', name: 'Fibonacci Line' },
        { id: 'fibonacci_retracement', name: 'Fibonacci Retracement' },
        { id: 'fibonacci_extension', name: 'Fibonacci Extension' },
        { id: 'fibonacci_circle', name: 'Fibonacci Circle' },
      ],
    },
    {
      id: 'wave',
      name: 'Wave',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s1.5-4 5-4 5 4 9 4 5-4 5-4"></path>
        </svg>
      ),
      tools: [
        { id: 'wave_principle', name: 'Wave Principle' },
        { id: 'wave_five', name: 'Wave Five' },
        { id: 'wave_three', name: 'Wave Three' },
      ],
    },
    {
      id: 'text',
      name: 'Text',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h16v3"></path>
          <path d="M9 20h6"></path>
          <path d="M12 4v16"></path>
        </svg>
      ),
      tools: [
        { id: 'text', name: 'Text' },
      ],
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
          <path d="M22 21H7"></path>
          <path d="m5 11 9 9"></path>
        </svg>
      ),
      tools: [
        { id: 'eraser', name: 'Eraser' },
      ],
    },
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

  // Handle clicking on a drawing tool category
  const handleDrawingToolCategoryClick = (categoryId: string) => {
    if (activeDrawingToolCategory === categoryId) {
      // If the same category is clicked again, toggle the submenu
      setShowDrawingToolSubmenu(!showDrawingToolSubmenu);
    } else {
      // If a different category is clicked, show the submenu for that category
      setActiveDrawingToolCategory(categoryId);
      setShowDrawingToolSubmenu(true);
    }
  };

  // Handle selecting a specific drawing tool
  const handleSelectDrawingTool = (toolId: string) => {
    if (chartRef.current) {
      // Set the selected drawing tool
      setSelectedDrawingTool(toolId);
      setShowDrawingToolSubmenu(false);

      // In a real implementation, you would activate the drawing tool on the chart
      console.log(`Selected drawing tool: ${toolId}`);

      // For demonstration purposes, let's simulate activating the drawing tool
      try {
        // This is a simplified example - in a real implementation, you would use the proper API
        // to activate the drawing tool based on its type
        chartRef.current.createOverlay({
          name: toolId,
          points: [], // Points will be added by user interaction
          styles: {
            color: '#1E88E5',
            size: 1,
          },
        });
      } catch (error) {
        console.error('Error activating drawing tool:', error);
      }
    }
  };

  // Handle click outside to close drawing tool submenu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawingToolSubmenuRef.current && !drawingToolSubmenuRef.current.contains(event.target as Node)) {
        setShowDrawingToolSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="w-12 border-r border-white/10 flex flex-col items-center py-2 space-y-2 relative">
            {/* Drawing Tool Categories */}
            {drawingToolCategories.map((category) => (
              <button
                key={category.id}
                className={`p-2 rounded ${activeDrawingToolCategory === category.id && showDrawingToolSubmenu ? 'bg-primary text-primary-foreground' : 'hover:bg-card/50'}`}
                onClick={() => handleDrawingToolCategoryClick(category.id)}
              >
                {category.icon}
              </button>
            ))}

            {/* Drawing Tool Submenu */}
            {showDrawingToolSubmenu && activeDrawingToolCategory && (
              <div
                ref={drawingToolSubmenuRef}
                className="absolute left-full top-0 ml-2 w-48 bg-card border border-white/10 rounded-md shadow-lg py-1 z-10"
              >
                <div className="px-3 py-2 text-xs font-semibold border-b border-white/10">
                  {drawingToolCategories.find(c => c.id === activeDrawingToolCategory)?.name}
                </div>
                {drawingToolCategories
                  .find(c => c.id === activeDrawingToolCategory)
                  ?.tools.map(tool => (
                    <button
                      key={tool.id}
                      className={`w-full text-left px-3 py-1.5 text-xs ${selectedDrawingTool === tool.id ? 'bg-primary/20' : 'hover:bg-card/80'}`}
                      onClick={() => handleSelectDrawingTool(tool.id)}
                    >
                      {tool.name}
                    </button>
                  ))
                }
              </div>
            )}
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
