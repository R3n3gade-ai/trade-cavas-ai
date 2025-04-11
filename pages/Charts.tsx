import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    
    // Create chart instance with enhanced features
    const chart = klinecharts.init(containerRef.current, {
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
    });
    
    // Generate random data
    function generateRandomData(baseTimestamp, basePrice, dataSize) {
      const dataList = [];
      let timestamp = baseTimestamp;
      let price = basePrice;
      for (let i = 0; i < dataSize; i++) {
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
      return dataList;
    }
    
    const timestamp = Date.now();
    const dataList = generateRandomData(timestamp - 60 * 60 * 1000 * 200, 5000, 200);
    chart.applyNewData(dataList);
    
    // Add indicators
    chart.createIndicator('MA', false);
    chart.createIndicator('VOL', true);
    
    // Clean up on unmount
    return () => {
      chart.dispose();
    };
  }, []);
  
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full" ref={containerRef}></div>
    </DashboardLayout>
  );
};

export default Charts;
