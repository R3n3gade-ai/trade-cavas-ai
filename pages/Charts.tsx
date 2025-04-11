import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { KLineChart } from '@klinecharts/pro';

// Import all extensions
// Note: In a real implementation, you would import the extensions from the klinecharts-extension directory
// For now, we'll use the built-in extensions from KLineChart Pro

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    
    // Create KLineChart Pro instance with all features
    const chart = new KLineChart({
      container: containerRef.current,
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
      },
      drawingBarVisible: true, // Enable drawing toolbar
      symbol: {
        ticker: 'BTC/USDT',
        name: 'Bitcoin',
        shortName: 'BTC',
        exchange: 'Binance',
        market: 'Crypto',
        pricePrecision: 2,
        volumePrecision: 0,
      },
      period: {
        multiplier: 15,
        timespan: 'minute',
        text: '15m',
      },
      periods: [
        { multiplier: 1, timespan: 'minute', text: '1m' },
        { multiplier: 5, timespan: 'minute', text: '5m' },
        { multiplier: 15, timespan: 'minute', text: '15m' },
        { multiplier: 30, timespan: 'minute', text: '30m' },
        { multiplier: 1, timespan: 'hour', text: '1h' },
        { multiplier: 2, timespan: 'hour', text: '2h' },
        { multiplier: 4, timespan: 'hour', text: '4h' },
        { multiplier: 1, timespan: 'day', text: 'D' },
        { multiplier: 1, timespan: 'week', text: 'W' },
        { multiplier: 1, timespan: 'month', text: 'M' },
        { multiplier: 1, timespan: 'year', text: 'Y' },
      ],
      mainIndicators: ['MA', 'EMA', 'BOLL'], // Main chart indicators
      subIndicators: ['VOL', 'MACD'], // Sub-pane indicators
      datafeed: {
        // Generate random data for demonstration
        getHistoryData: ({ symbol, period, from, to }) => {
          return new Promise(resolve => {
            const dataList = [];
            let timestamp = from || Date.now() - 60 * 60 * 1000 * 200;
            let price = 5000;
            
            for (let i = 0; i < 200; i++) {
              price = price + Math.random() * 20 - 10;
              timestamp += 60 * 60 * 1000;
              const open = price + Math.random() * 20 - 10;
              const close = price + Math.random() * 20 - 10;
              const high = Math.max(open, close) + Math.random() * 20;
              const low = Math.min(open, close) - Math.random() * 20;
              const volume = Math.random() * 50 + 10;
              dataList.push({
                timestamp,
                open,
                high,
                low,
                close,
                volume,
              });
            }
            
            resolve({
              data: dataList,
              more: false,
            });
          });
        },
        // Subscribe to real-time data updates
        subscribe: ({ symbol, period, callback }) => {
          // In a real app, you would subscribe to real-time data here
          // For demonstration, we'll just update the data every 5 seconds
          const intervalId = setInterval(() => {
            const timestamp = Date.now();
            const price = 5000 + Math.random() * 100;
            const open = price + Math.random() * 20 - 10;
            const close = price + Math.random() * 20 - 10;
            const high = Math.max(open, close) + Math.random() * 20;
            const low = Math.min(open, close) - Math.random() * 20;
            const volume = Math.random() * 50 + 10;
            
            callback({
              timestamp,
              open,
              high,
              low,
              close,
              volume,
            });
          }, 5000);
          
          // Return a function to unsubscribe
          return () => {
            clearInterval(intervalId);
          };
        },
      },
    });
    
    // Store chart instance for later use
    chartRef.current = chart;

    // Register all available drawing tools
    // In a real implementation, you would register all the drawing tools from the extensions
    // For now, we'll use the built-in drawing tools from KLineChart Pro

    // Clean up on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);
  
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full" ref={containerRef}></div>
    </DashboardLayout>
  );
};

export default Charts;
