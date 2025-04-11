import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { KLineChart } from '@klinecharts/pro';

const Charts: React.FC = () => {
  // Chart container reference
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Chart state
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [period, setPeriod] = useState('15m');

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
      // Create KLineChart Pro instance
      chartRef.current = new KLineChart({
        container: chartContainerRef.current,
        styles: {
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
        },
        locale: 'en-US',
      });

      // Generate sample data
      const sampleData = generateSampleData();
      chartRef.current.applyNewData(sampleData);

      // Add initial indicators
      chartRef.current.createIndicator('MA');
      chartRef.current.createIndicator('VOL', true);
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
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

  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full">
        {/* KLineChart Pro Component */}
        <div className="h-full w-full" ref={chartContainerRef}></div>
      </div>
    </DashboardLayout>
  );
};

export default Charts;
