import React, { useEffect, useRef } from 'react';
import * as klinecharts from 'klinecharts';

interface TradingChartProps {
  data?: any[];
  theme?: 'light' | 'dark';
  symbol?: string;
  interval?: string;
  height?: number;
  width?: string | number;
  className?: string;
}

const TradingChart: React.FC<TradingChartProps> = ({
  data = [],
  theme = 'dark',
  symbol = 'AAPL',
  interval = '1D',
  height = 500,
  width = '100%',
  className = '',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      // Create chart instance
      chartRef.current = klinecharts.init(chartContainerRef.current, {
        theme: theme === 'dark' ? 'dark' : 'light',
        grid: {
          show: true,
          horizontal: {
            show: true,
            size: 1,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            style: 'solid',
          },
          vertical: {
            show: true,
            size: 1,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
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
        },
        xAxis: {
          show: true,
          height: 20,
          axisLine: {
            show: true,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            size: 1,
          },
          tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
          tickText: {
            show: true,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            size: 12,
            family: 'Roboto, sans-serif',
            weight: 'normal',
          },
        },
        yAxis: {
          show: true,
          width: 60,
          position: 'right',
          axisLine: {
            show: true,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            size: 1,
          },
          tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
          tickText: {
            show: true,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            size: 12,
            family: 'Roboto, sans-serif',
            weight: 'normal',
          },
        },
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: {
              show: true,
              style: 'dashed',
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              size: 1,
            },
            text: {
              show: true,
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              size: 12,
              family: 'Roboto, sans-serif',
              weight: 'normal',
              background: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 2,
            },
          },
          vertical: {
            show: true,
            line: {
              show: true,
              style: 'dashed',
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              size: 1,
            },
            text: {
              show: true,
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              size: 12,
              family: 'Roboto, sans-serif',
              weight: 'normal',
              background: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 2,
            },
          },
        },
      });

      // Add technical indicators
      chartRef.current.createIndicator('MA');
      chartRef.current.createIndicator('VOLUME', true);
      chartRef.current.createIndicator('MACD', true);
      chartRef.current.createIndicator('RSI', true);

      // Clean up on unmount
      return () => {
        if (chartRef.current) {
          chartRef.current.dispose();
        }
      };
    }
  }, [theme]);

  // Update data when it changes
  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      chartRef.current.applyNewData(data);
    }
  }, [data]);

  // Generate sample data if no data is provided
  useEffect(() => {
    if (chartRef.current && (!data || data.length === 0)) {
      const sampleData = generateSampleData();
      chartRef.current.applyNewData(sampleData);
    }
  }, [data]);

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
    <div className={`trading-chart-container ${className}`} style={{ width, height }}>
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TradingChart;
