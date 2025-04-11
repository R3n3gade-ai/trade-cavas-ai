import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { KLineChart } from '@klinecharts/pro';

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
      },
      drawingBarVisible: true,
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
        { multiplier: 4, timespan: 'hour', text: '4h' },
        { multiplier: 1, timespan: 'day', text: '1d' },
        { multiplier: 1, timespan: 'week', text: '1w' },
      ],
      mainIndicators: ['MA', 'EMA', 'BOLL'],
      subIndicators: ['VOL', 'MACD', 'KDJ', 'RSI'],
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

    // Clean up on unmount
    return () => {
      chart.destroy();
    };
  }, []);
  
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full" ref={containerRef}></div>
    </DashboardLayout>
  );
};

export default Charts;
