import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import * as klinecharts from 'klinecharts';

const Charts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

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
    
    // Store chart instance for later use
    chartRef.current = chart;
    
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
    
    // Create drawing tools toolbar
    const toolbarContainer = document.createElement('div');
    toolbarContainer.style.position = 'absolute';
    toolbarContainer.style.top = '60px';
    toolbarContainer.style.right = '20px';
    toolbarContainer.style.display = 'flex';
    toolbarContainer.style.flexDirection = 'column';
    toolbarContainer.style.gap = '8px';
    toolbarContainer.style.backgroundColor = '#1e1e1e';
    toolbarContainer.style.padding = '8px';
    toolbarContainer.style.borderRadius = '4px';
    toolbarContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    toolbarContainer.style.zIndex = '10';
    containerRef.current.appendChild(toolbarContainer);
    
    // Create drawing tool categories
    const categories = [
      { name: 'Line Tools', icon: 'line' },
      { name: 'Fibonacci Tools', icon: 'fibonacciLine' },
      { name: 'Pattern Tools', icon: 'circle' },
      { name: 'Text Tools', icon: 'text' },
      { name: 'Measure Tools', icon: 'horizontalLine' },
    ];
    
    // Create category buttons
    categories.forEach((category, index) => {
      const categoryContainer = document.createElement('div');
      categoryContainer.style.position = 'relative';
      categoryContainer.style.cursor = 'pointer';
      
      const button = document.createElement('button');
      button.textContent = category.name;
      button.style.padding = '8px 12px';
      button.style.backgroundColor = '#2e2e2e';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '12px';
      button.style.fontWeight = 'bold';
      button.style.width = '100%';
      button.style.textAlign = 'left';
      
      // Create submenu
      const submenu = document.createElement('div');
      submenu.style.position = 'absolute';
      submenu.style.left = '100%';
      submenu.style.top = '0';
      submenu.style.backgroundColor = '#2e2e2e';
      submenu.style.padding = '8px';
      submenu.style.borderRadius = '4px';
      submenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
      submenu.style.display = 'none';
      submenu.style.zIndex = '11';
      submenu.style.minWidth = '150px';
      
      // Show submenu on hover
      categoryContainer.addEventListener('mouseenter', () => {
        submenu.style.display = 'block';
      });
      
      categoryContainer.addEventListener('mouseleave', () => {
        submenu.style.display = 'none';
      });
      
      // Add tools to submenu based on category
      let tools = [];
      
      if (category.name === 'Line Tools') {
        tools = [
          { name: 'Line', value: 'line' },
          { name: 'Ray', value: 'rayLine' },
          { name: 'Arrow', value: 'arrow' },
          { name: 'Horizontal Line', value: 'horizontalLine' },
          { name: 'Vertical Line', value: 'verticalLine' },
          { name: 'Parallel Line', value: 'parallelLine' },
          { name: 'Price Line', value: 'priceLine' },
        ];
      } else if (category.name === 'Fibonacci Tools') {
        tools = [
          { name: 'Fibonacci Line', value: 'fibonacciLine' },
          { name: 'Fibonacci Extension', value: 'fibonacciLine' },
          { name: 'Fibonacci Fan', value: 'fibonacciLine' },
          { name: 'Fibonacci Arc', value: 'fibonacciLine' },
          { name: 'Fibonacci Circle', value: 'fibonacciLine' },
          { name: 'Fibonacci Time Zones', value: 'fibonacciLine' },
          { name: 'Fibonacci Spiral', value: 'fibonacciLine' },
        ];
      } else if (category.name === 'Pattern Tools') {
        tools = [
          { name: 'Rectangle', value: 'rect' },
          { name: 'Circle', value: 'circle' },
          { name: 'Triangle', value: 'triangle' },
          { name: 'Wave Pattern', value: 'line' },
          { name: 'ABC Pattern', value: 'line' },
          { name: 'Elliott Wave', value: 'line' },
        ];
      } else if (category.name === 'Text Tools') {
        tools = [
          { name: 'Text', value: 'text' },
          { name: 'Annotation', value: 'simpleAnnotation' },
          { name: 'Tag', value: 'simpleTag' },
        ];
      } else if (category.name === 'Measure Tools') {
        tools = [
          { name: 'Measure Line', value: 'line' },
          { name: 'Measure Angle', value: 'line' },
          { name: 'Measure Rectangle', value: 'rect' },
          { name: 'Price Range', value: 'priceLine' },
          { name: 'Percentage', value: 'priceLine' },
        ];
      }
      
      // Add tools to submenu
      tools.forEach(tool => {
        const toolButton = document.createElement('button');
        toolButton.textContent = tool.name;
        toolButton.style.padding = '6px 12px';
        toolButton.style.backgroundColor = 'transparent';
        toolButton.style.color = 'white';
        toolButton.style.border = 'none';
        toolButton.style.borderRadius = '4px';
        toolButton.style.cursor = 'pointer';
        toolButton.style.fontSize = '12px';
        toolButton.style.display = 'block';
        toolButton.style.width = '100%';
        toolButton.style.textAlign = 'left';
        
        toolButton.addEventListener('mouseenter', () => {
          toolButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        toolButton.addEventListener('mouseleave', () => {
          toolButton.style.backgroundColor = 'transparent';
        });
        
        toolButton.addEventListener('click', () => {
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
        
        submenu.appendChild(toolButton);
      });
      
      categoryContainer.appendChild(button);
      categoryContainer.appendChild(submenu);
      toolbarContainer.appendChild(categoryContainer);
      
      // Add separator after each category except the last one
      if (index < categories.length - 1) {
        const separator = document.createElement('div');
        separator.style.height = '1px';
        separator.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        separator.style.margin = '4px 0';
        toolbarContainer.appendChild(separator);
      }
    });
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.style.padding = '8px 12px';
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
    indicatorContainer.style.top = '60px';
    indicatorContainer.style.left = '20px';
    indicatorContainer.style.display = 'flex';
    indicatorContainer.style.flexDirection = 'column';
    indicatorContainer.style.gap = '8px';
    indicatorContainer.style.backgroundColor = '#1e1e1e';
    indicatorContainer.style.padding = '8px';
    indicatorContainer.style.borderRadius = '4px';
    indicatorContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    indicatorContainer.style.zIndex = '10';
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
    
    // Create period toolbar
    const periodContainer = document.createElement('div');
    periodContainer.style.position = 'absolute';
    periodContainer.style.top = '10px';
    periodContainer.style.left = '50%';
    periodContainer.style.transform = 'translateX(-50%)';
    periodContainer.style.display = 'flex';
    periodContainer.style.gap = '4px';
    periodContainer.style.backgroundColor = '#1e1e1e';
    periodContainer.style.padding = '4px';
    periodContainer.style.borderRadius = '4px';
    periodContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    periodContainer.style.zIndex = '10';
    containerRef.current.appendChild(periodContainer);
    
    // Period options
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
    
    // Create period buttons
    periods.forEach((period, index) => {
      const button = document.createElement('button');
      button.textContent = period.text;
      button.style.padding = '4px 8px';
      button.style.backgroundColor = index === 2 ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '2px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '12px';
      
      button.addEventListener('mouseenter', () => {
        if (index !== 2) {
          button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (index !== 2) {
          button.style.backgroundColor = 'transparent';
        }
      });
      
      periodContainer.appendChild(button);
    });
    
    // Clean up on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);
  
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full relative" ref={containerRef}></div>
    </DashboardLayout>
  );
};

export default Charts;
