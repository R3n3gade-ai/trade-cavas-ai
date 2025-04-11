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

  // Indicator state
  const [activeIndicators, setActiveIndicators] = useState<Array<{
    id: string;
    name: string;
    visible: boolean;
    params: number[];
    paneId?: string;
  }>>([]);
  const [showIndicatorSettings, setShowIndicatorSettings] = useState<string | null>(null);
  const indicatorSettingsRef = useRef<HTMLDivElement>(null);

  // OHLCV info state
  const [ohlcvInfo, setOhlcvInfo] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number;
  } | null>(null);

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
      // Log available overlay types for debugging
      console.log('Available overlay types:', klinecharts.getOverlayClass());
      // Create chart instance with enhanced features
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
        technicalIndicator: {
          bar: {
            upColor: '#26A69A',
            downColor: '#EF5350',
            noChangeColor: '#888888',
          },
          line: {
            size: 1,
          },
        },
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: {
              show: true,
              style: 'dashed',
              dashedValue: [4, 2],
              size: 1,
              color: 'rgba(255, 255, 255, 0.3)',
            },
            text: {
              show: true,
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 2,
              padding: [4, 6],
              fontSize: 12,
            },
          },
          vertical: {
            show: true,
            line: {
              show: true,
              style: 'dashed',
              dashedValue: [4, 2],
              size: 1,
              color: 'rgba(255, 255, 255, 0.3)',
            },
            text: {
              show: true,
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 2,
              padding: [4, 6],
              fontSize: 12,
            },
          },
        },
        yAxis: {
          show: true,
          position: 'right',
          type: 'normal',
          inside: false,
          reverse: false,
          tickText: {
            show: true,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            paddingRight: 4,
          },
          axisLine: {
            show: true,
            color: 'rgba(255, 255, 255, 0.2)',
            size: 1,
          },
        },
        xAxis: {
          show: true,
          tickText: {
            show: true,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            paddingTop: 4,
          },
          axisLine: {
            show: true,
            color: 'rgba(255, 255, 255, 0.2)',
            size: 1,
          },
        },
        separator: {
          size: 1,
          color: 'rgba(255, 255, 255, 0.2)',
          fill: true,
          activeBackgroundColor: 'rgba(230, 230, 230, 0.15)',
        },
      });

      // Generate sample data
      const sampleData = generateSampleData();
      chartRef.current.applyNewData(sampleData);

      // Add initial indicators
      const initialIndicators = [
        { name: 'MA', isNewPane: false },
        { name: 'VOL', isNewPane: true },
      ];

      initialIndicators.forEach(({ name, isNewPane }) => {
        const indicator = indicators.find(ind => ind.name === name);
        if (indicator) {
          // Create the indicator on the chart
          const paneId = chartRef.current.createIndicator(name, isNewPane);

          // Add to active indicators list
          const id = `${name}_${Date.now()}`;
          setActiveIndicators(prev => [
            ...prev,
            {
              id,
              name,
              visible: true,
              params: [...indicator.params], // Clone the params
              paneId,
            }
          ]);
        }
      });

      // Add crosshair move event listener to update OHLCV info
      chartRef.current.subscribeAction('crosshair', ({ kLineData }) => {
        if (kLineData) {
          const { timestamp, open, high, low, close, volume } = kLineData;
          setOhlcvInfo({ timestamp, open, high, low, close, volume });
        } else {
          setOhlcvInfo(null);
        }
      });

      // Add zoom event listener
      chartRef.current.subscribeAction('zoom', ({ scale }) => {
        console.log(`Zoom scale: ${scale}`);
      });

      // Add pane drag event listener
      chartRef.current.subscribeAction('pane_drag', ({ paneId, dragStartY, dragEndY }) => {
        console.log(`Pane drag: ${paneId}, ${dragStartY} -> ${dragEndY}`);
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

        // Create a unique ID for this indicator instance
        const id = `${indicatorName}_${Date.now()}`;

        // Create the indicator on the chart
        const paneId = chartRef.current.createIndicator(indicator.name, isNewPane);

        // Add to active indicators list
        setActiveIndicators(prev => [
          ...prev,
          {
            id,
            name: indicator.name,
            visible: true,
            params: [...indicator.params], // Clone the params
            paneId,
          }
        ]);
      }
    }
  };

  // Handle removing an indicator
  const handleRemoveIndicator = (indicatorId: string) => {
    if (chartRef.current) {
      // Find the indicator in our active list
      const indicator = activeIndicators.find(ind => ind.id === indicatorId);
      if (indicator) {
        // Remove from chart
        chartRef.current.removeIndicator(indicator.name, indicator.paneId);

        // Remove from active indicators list
        setActiveIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
      }
    }
  };

  // Handle toggling indicator visibility
  const handleToggleIndicatorVisibility = (indicatorId: string) => {
    if (chartRef.current) {
      setActiveIndicators(prev => {
        const updated = prev.map(ind => {
          if (ind.id === indicatorId) {
            // Toggle visibility
            const newVisibility = !ind.visible;

            // Update on chart
            if (newVisibility) {
              // Show indicator
              chartRef.current.createIndicator(ind.name, ind.paneId ? true : false, { id: ind.paneId });
            } else {
              // Hide indicator
              chartRef.current.removeIndicator(ind.name, ind.paneId);
            }

            return { ...ind, visible: newVisibility };
          }
          return ind;
        });
        return updated;
      });
    }
  };

  // Handle updating indicator parameters
  const handleUpdateIndicatorParams = (indicatorId: string, newParams: number[]) => {
    if (chartRef.current) {
      setActiveIndicators(prev => {
        const updated = prev.map(ind => {
          if (ind.id === indicatorId) {
            // Update params
            const updatedInd = { ...ind, params: newParams };

            // Update on chart
            if (ind.visible) {
              // Remove and recreate with new params
              chartRef.current.removeIndicator(ind.name, ind.paneId);
              chartRef.current.createIndicator(ind.name, ind.paneId ? true : false, {
                id: ind.paneId,
                params: newParams,
              });
            }

            return updatedInd;
          }
          return ind;
        });
        return updated;
      });
    }
  };

  // Handle opening indicator settings
  const handleOpenIndicatorSettings = (indicatorId: string) => {
    setShowIndicatorSettings(indicatorId);
  };

  // Handle click outside to close indicator settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (indicatorSettingsRef.current && !indicatorSettingsRef.current.contains(event.target as Node)) {
        setShowIndicatorSettings(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Function to get the icon for a specific drawing tool
  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      // Line tools
      case 'line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
          </svg>
        );
      case 'ray':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l18 18"></path>
          </svg>
        );
      case 'arrow':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        );
      case 'horizontal_line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18"></path>
          </svg>
        );
      case 'horizontal_ray':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18"></path>
            <path d="M21 12v6"></path>
          </svg>
        );
      case 'vertical_line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18"></path>
          </svg>
        );
      case 'price_line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18"></path>
            <path d="M21 8v8"></path>
          </svg>
        );

      // Segment tools
      case 'segment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l6 6"></path>
            <path d="M15 15l6 6"></path>
          </svg>
        );
      case 'parallel_line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8L19 8"></path>
            <path d="M5 16L19 16"></path>
          </svg>
        );
      case 'price_channel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7l14 4"></path>
            <path d="M5 17l14-6"></path>
          </svg>
        );

      // Rectangle tools
      case 'rect':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        );
      case 'parallel_channel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l18 12"></path>
            <path d="M3 18l18-12"></path>
          </svg>
        );

      // Circle tools
      case 'circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        );
      case 'arc':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 18 0"></path>
          </svg>
        );

      // Fibonacci tools
      case 'fibonacci_line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="m3 9 18-6"></path>
          </svg>
        );
      case 'fibonacci_retracement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
          </svg>
        );
      case 'fibonacci_extension':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M3 21h18"></path>
          </svg>
        );
      case 'fibonacci_circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
        );

      // Wave tools
      case 'wave_principle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s1.5-4 5-4 5 4 9 4 5-4 5-4"></path>
          </svg>
        );
      case 'wave_five':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s1-4 4-4 6 8 10 8 6-12 6-12"></path>
          </svg>
        );
      case 'wave_three':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s1-6 5-6 5 12 10 12 5-18 5-18"></path>
          </svg>
        );

      // Text tool
      case 'text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3"></path>
            <path d="M9 20h6"></path>
            <path d="M12 4v16"></path>
          </svg>
        );

      // Eraser tool
      case 'eraser':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
            <path d="M22 21H7"></path>
            <path d="m5 11 9 9"></path>
          </svg>
        );

      default:
        return null;
    }
  };

  // Map drawing tool IDs to KLineChart overlay names
  const drawingToolToOverlayMap: Record<string, string> = {
    // Line tools
    'line': 'line',
    'ray': 'ray',
    'arrow': 'arrow',
    'horizontal_line': 'horizontalLine',
    'horizontal_ray': 'horizontalRay',
    'vertical_line': 'verticalLine',
    'price_line': 'priceLine',

    // Segment tools
    'segment': 'segment',
    'parallel_line': 'parallelLine',
    'price_channel': 'priceChannel',

    // Rectangle tools
    'rect': 'rect',
    'parallel_channel': 'parallelChannel',

    // Circle tools
    'circle': 'circle',
    'arc': 'arc',

    // Fibonacci tools
    'fibonacci_line': 'fibonacciLine',
    'fibonacci_retracement': 'fibonacciSegment',
    'fibonacci_extension': 'fibonacciExtension',
    'fibonacci_circle': 'fibonacciCircle',

    // Wave tools
    'wave_principle': 'simpleWave',
    'wave_five': 'waveTheory',
    'wave_three': 'waveTheory',

    // Text tool
    'text': 'text',

    // Eraser tool (special case)
    'eraser': 'eraser',
  };

  // Handle selecting a specific drawing tool
  const handleSelectDrawingTool = (toolId: string) => {
    if (chartRef.current) {
      // Set the selected drawing tool
      setSelectedDrawingTool(toolId);
      setShowDrawingToolSubmenu(false);

      try {
        // First, cancel any existing drawing operation
        chartRef.current.removeOverlay();

        // Special cases for different tools
        switch (toolId) {
          case 'line':
            chartRef.current.createOverlay({
              name: 'segment',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'ray':
            chartRef.current.createOverlay({
              name: 'ray',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'segment':
            chartRef.current.createOverlay({
              name: 'segment',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'arrow':
            chartRef.current.createOverlay({
              name: 'arrow',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'horizontal_line':
            chartRef.current.createOverlay({
              name: 'horizontalStraightLine',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'vertical_line':
            chartRef.current.createOverlay({
              name: 'verticalStraightLine',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'rect':
            chartRef.current.createOverlay({
              name: 'rect',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'circle':
            chartRef.current.createOverlay({
              name: 'circle',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'text':
            chartRef.current.createOverlay({
              name: 'text',
              styles: { color: '#1E88E5', size: 14 },
              extendData: 'Text',
            });
            break;
          case 'fibonacci_retracement':
            chartRef.current.createOverlay({
              name: 'fibonacciLine',
              styles: { color: '#1E88E5', size: 1 },
            });
            break;
          case 'eraser':
            chartRef.current.createOverlay({
              name: 'eraser',
            });
            break;
          default:
            // For any other tool, try to use the segment as fallback
            chartRef.current.createOverlay({
              name: 'segment',
              styles: { color: '#1E88E5', size: 1 },
            });
            console.log(`Using segment as fallback for tool: ${toolId}`);
            break;
        }

        // Log success message
        console.log(`Activated drawing tool: ${toolId}`);
      } catch (error) {
        console.error(`Error activating drawing tool ${toolId}:`, error);
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
                className={`p-2 rounded ${activeDrawingToolCategory === category.id && showDrawingToolSubmenu ? 'bg-primary text-primary-foreground' : category.tools.some(tool => tool.id === selectedDrawingTool) ? 'bg-primary/20' : 'hover:bg-card/50'}`}
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
                      className={`w-full text-left px-3 py-1.5 text-xs ${selectedDrawingTool === tool.id ? 'bg-primary/20' : 'hover:bg-card/80'} flex items-center`}
                      onClick={() => handleSelectDrawingTool(tool.id)}
                    >
                      <span className="w-5 h-5 mr-2 flex items-center justify-center">
                        {getToolIcon(tool.id)}
                      </span>
                      {tool.name}
                    </button>
                  ))
                }

                {/* Clear All Drawings Button */}
                <div className="mt-2 pt-2 border-t border-white/10 px-3">
                  <button
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-card/80 flex items-center text-red-400"
                    onClick={() => {
                      if (chartRef.current) {
                        chartRef.current.removeOverlay({ removeAll: true });
                        setSelectedDrawingTool(null);
                        setShowDrawingToolSubmenu(false);
                      }
                    }}
                  >
                    <span className="w-5 h-5 mr-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </span>
                    Clear All Drawings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chart with Indicator Settings */}
          <div className="flex-1 relative" ref={chartContainerRef}>
            {/* Indicator Labels */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              {activeIndicators.map(indicator => (
                <div
                  key={indicator.id}
                  className={`flex items-center space-x-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs ${!indicator.visible ? 'opacity-50' : ''}`}
                >
                  <span className="font-medium">{indicator.name}</span>
                  <span className="text-muted-foreground">
                    ({indicator.params.join(', ')})
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => handleOpenIndicatorSettings(indicator.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => handleToggleIndicatorVisibility(indicator.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {indicator.visible ? (
                          <>
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </>
                        ) : (
                          <>
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </>
                        )}
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-card/80"
                      onClick={() => handleRemoveIndicator(indicator.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator Settings Panel */}
            {showIndicatorSettings && (
              <div
                ref={indicatorSettingsRef}
                className="absolute top-4 right-4 w-64 bg-card border border-white/10 rounded-md shadow-lg p-4 z-10"
              >
                {(() => {
                  const indicator = activeIndicators.find(ind => ind.id === showIndicatorSettings);
                  if (!indicator) return null;

                  const indicatorDef = indicators.find(ind => ind.name === indicator.name);
                  if (!indicatorDef) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{indicator.name} Settings</h3>
                        <button
                          className="p-1 rounded hover:bg-card/80"
                          onClick={() => setShowIndicatorSettings(null)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {indicator.params.map((param, index) => (
                          <div key={index} className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                              Parameter {index + 1}
                            </label>
                            <input
                              type="number"
                              value={param}
                              onChange={(e) => {
                                const newParams = [...indicator.params];
                                newParams[index] = Number(e.target.value);
                                handleUpdateIndicatorParams(indicator.id, newParams);
                              }}
                              className="w-full px-2 py-1 text-sm bg-background border border-white/10 rounded focus:outline-none focus:border-primary"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          className="px-3 py-1 text-xs rounded bg-card/50 hover:bg-card border border-white/10"
                          onClick={() => setShowIndicatorSettings(null)}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
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

              {/* OHLC Chart */}
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => handleChangeChartType('ohlc')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
              </button>

              {/* Area Chart */}
              <button
                className="p-1.5 rounded hover:bg-card/50"
                onClick={() => handleChangeChartType('area')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M3 18s3-6 7-6 5 4 9 4 5-4 5-4"></path>
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
                    chartRef.current.zoom(0.5);
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
                    chartRef.current.zoom(2);
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

          {/* OHLCV Info */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {ohlcvInfo ? (
              <>
                <span className="font-medium">O: {ohlcvInfo.open.toFixed(2)}</span>
                <span className="font-medium">H: {ohlcvInfo.high.toFixed(2)}</span>
                <span className="font-medium">L: {ohlcvInfo.low.toFixed(2)}</span>
                <span className="font-medium">C: {ohlcvInfo.close.toFixed(2)}</span>
                <span className="font-medium">V: {ohlcvInfo.volume.toFixed(0)}</span>
                <span className="font-medium">{new Date(ohlcvInfo.timestamp).toLocaleTimeString()}</span>
              </>
            ) : (
              <span>Hover over chart to see OHLCV data</span>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Charts;
