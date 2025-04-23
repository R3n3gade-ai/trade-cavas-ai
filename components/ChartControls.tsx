import React, { useState, useRef, useCallback } from 'react';
import { useTickerStore, TimeInterval, TimeFrame } from '../utils/tickerStore';
import { ChevronDown } from 'lucide-react';

const ChartControls: React.FC = () => {
  const {
    availableIntervals,
    currentInterval,
    setCurrentInterval,
    availableTimeFrames,
    currentTimeFrame,
    setCurrentTimeFrame
  } = useTickerStore();

  const [isIntervalDropdownOpen, setIsIntervalDropdownOpen] = useState(false);
  const [isTimeFrameDropdownOpen, setIsTimeFrameDropdownOpen] = useState(false);
  const lastChangeTime = useRef<number>(0);

  // Throttle function to prevent rapid changes
  const throttle = useCallback((callback: Function, interval: TimeInterval | TimeFrame) => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeTime.current;

    // Only allow changes every 1000ms (1 second)
    if (timeSinceLastChange > 1000) {
      callback(interval);
      lastChangeTime.current = now;
    } else {
      console.log(`Change throttled. Please wait ${Math.ceil((1000 - timeSinceLastChange) / 1000)} seconds.`);
    }
  }, []);

  const handleIntervalChange = (interval: TimeInterval) => {
    throttle(() => {
      setCurrentInterval(interval);
      setIsIntervalDropdownOpen(false);
    }, interval);
  };

  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    throttle(() => {
      setCurrentTimeFrame(timeFrame);
      setIsTimeFrameDropdownOpen(false);
    }, timeFrame);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Interval Dropdown (Candle Size) */}
      <div className="relative">
        <button
          onClick={() => setIsIntervalDropdownOpen(!isIntervalDropdownOpen)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-card border border-white/10 rounded-md text-sm hover:bg-card/70 transition-colors"
        >
          <span>{currentInterval.label}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isIntervalDropdownOpen && (
          <div className="absolute z-10 mt-1 w-32 bg-card border border-white/10 rounded-md shadow-lg">
            <div className="py-1">
              {availableIntervals.map((interval) => (
                <button
                  key={interval.label}
                  onClick={() => handleIntervalChange(interval)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentInterval.label === interval.label
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-card/70'
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Frame Dropdown (Period) */}
      <div className="relative">
        <button
          onClick={() => setIsTimeFrameDropdownOpen(!isTimeFrameDropdownOpen)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-card border border-white/10 rounded-md text-sm hover:bg-card/70 transition-colors"
        >
          <span>{currentTimeFrame.text}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isTimeFrameDropdownOpen && (
          <div className="absolute z-10 mt-1 w-32 bg-card border border-white/10 rounded-md shadow-lg">
            <div className="py-1">
              {availableTimeFrames.map((timeFrame) => (
                <button
                  key={timeFrame.text}
                  onClick={() => handleTimeFrameChange(timeFrame)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentTimeFrame.text === timeFrame.text
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-card/70'
                  }`}
                >
                  {timeFrame.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartControls;
