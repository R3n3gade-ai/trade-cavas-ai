import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const chart = klinecharts.init(containerRef.current);
    
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
