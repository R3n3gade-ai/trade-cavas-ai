import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    
    // Initialize chart
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
    chart.createIndicator('BOLL', false);
    chart.createIndicator('VOL', true);
    chart.createIndicator('MACD', true);
    
    // Create drawing tools
    const toolbarContainer = document.createElement('div');
    toolbarContainer.style.position = 'absolute';
    toolbarContainer.style.top = '12px';
    toolbarContainer.style.right = '12px';
    toolbarContainer.style.display = 'flex';
    toolbarContainer.style.flexDirection = 'column';
    toolbarContainer.style.gap = '8px';
    containerRef.current.appendChild(toolbarContainer);
    
    // Drawing tools
    const drawingTools = [
      { name: 'Line', value: 'line' },
      { name: 'Ray', value: 'ray' },
      { name: 'Arrow', value: 'arrow' },
      { name: 'Horizontal', value: 'horizontalLine' },
      { name: 'Vertical', value: 'verticalLine' },
      { name: 'Rect', value: 'rect' },
      { name: 'Circle', value: 'circle' },
      { name: 'Parallel', value: 'parallelLine' },
      { name: 'Fibonacci', value: 'fibonacciLine' },
      { name: 'Text', value: 'text' },
    ];
    
    // Create drawing tools buttons
    drawingTools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool.name;
      button.style.padding = '6px 12px';
      button.style.backgroundColor = '#2e2e2e';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '12px';
      button.style.fontWeight = 'bold';
      
      button.addEventListener('click', () => {
        // Cancel any existing drawing
        chart.removeOverlay();
        // Start new drawing
        chart.createOverlay({
          name: tool.value,
          styles: {
            color: '#1E88E5',
            size: 1,
          },
        });
      });
      
      toolbarContainer.appendChild(button);
    });
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.style.padding = '6px 12px';
    clearButton.style.backgroundColor = '#EF5350';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '12px';
    clearButton.style.fontWeight = 'bold';
    clearButton.style.marginTop = '12px';
    
    clearButton.addEventListener('click', () => {
      chart.removeOverlay();
      chart.clearOverlay();
    });
    
    toolbarContainer.appendChild(clearButton);
    
    // Create indicator toolbar
    const indicatorContainer = document.createElement('div');
    indicatorContainer.style.position = 'absolute';
    indicatorContainer.style.top = '12px';
    indicatorContainer.style.left = '12px';
    indicatorContainer.style.display = 'flex';
    indicatorContainer.style.flexDirection = 'column';
    indicatorContainer.style.gap = '8px';
    containerRef.current.appendChild(indicatorContainer);
    
    // Indicator tools
    const indicators = [
      { name: 'MA', value: 'MA' },
      { name: 'EMA', value: 'EMA' },
      { name: 'BOLL', value: 'BOLL' },
      { name: 'SAR', value: 'SAR' },
      { name: 'MACD', value: 'MACD' },
      { name: 'KDJ', value: 'KDJ' },
      { name: 'RSI', value: 'RSI' },
      { name: 'VOL', value: 'VOL' },
    ];
    
    // Create indicator buttons
    indicators.forEach(indicator => {
      const button = document.createElement('button');
      button.textContent = indicator.name;
      button.style.padding = '6px 12px';
      button.style.backgroundColor = '#2e2e2e';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '12px';
      button.style.fontWeight = 'bold';
      
      button.addEventListener('click', () => {
        // Add indicator
        const isOverlay = ['MA', 'EMA', 'BOLL', 'SAR'].includes(indicator.value);
        chart.createIndicator(indicator.value, !isOverlay);
      });
      
      indicatorContainer.appendChild(button);
    });
    
    // Clean up on unmount
    return () => {
      chart.dispose();
    };
  }, []);
  
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full relative" ref={containerRef}></div>
    </DashboardLayout>
  );
};

export default Charts;
