import { create } from 'zustand';

// Define the available time intervals
export type TimeInterval = {
  multiplier: number;
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month';
  label: string;
};

// Define the available time frames
export type TimeFrame = {
  type: 'day' | 'month' | 'year' | 'ytd' | 'all';
  count: number;
  text: string;
  title: string;
};

interface TickerState {
  // Ticker symbol
  currentTicker: string;
  setCurrentTicker: (ticker: string) => void;

  // Time interval (for data grouping)
  currentInterval: TimeInterval;
  setCurrentInterval: (interval: TimeInterval) => void;
  availableIntervals: TimeInterval[];

  // Time frame (for range selector)
  currentTimeFrame: TimeFrame;
  setCurrentTimeFrame: (timeFrame: TimeFrame) => void;
  availableTimeFrames: TimeFrame[];

  // Indicator settings
  showUptickDowntick: boolean;
  setShowUptickDowntick: (show: boolean) => void;

  // Volume settings
  showVolume: boolean;
  setShowVolume: (show: boolean) => void;

  // Chart appearance settings
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;

  // Candle style: 'default', 'hollow', or 'colored'
  candleStyle: 'default' | 'hollow' | 'colored';
  setCandleStyle: (style: 'default' | 'hollow' | 'colored') => void;

  // Chart color settings
  chartBackgroundColor: string;
  setChartBackgroundColor: (color: string) => void;

  // Candlestick color settings
  upCandleColor: string;
  setUpCandleColor: (color: string) => void;
  downCandleColor: string;
  setDownCandleColor: (color: string) => void;

  // Reset colors to defaults
  resetColors: () => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  // Ticker settings
  currentTicker: 'AAPL', // Default ticker
  setCurrentTicker: (ticker: string) => set({ currentTicker: ticker }),

  // Time interval settings (candle size)
  currentInterval: { multiplier: 1, timespan: 'minute', label: '1min' },
  setCurrentInterval: (interval: TimeInterval) => set({ currentInterval: interval }),
  availableIntervals: [
    { multiplier: 1, timespan: 'minute', label: '1min' },
    { multiplier: 2, timespan: 'minute', label: '2min' },
    { multiplier: 5, timespan: 'minute', label: '5min' },
    { multiplier: 15, timespan: 'minute', label: '15min' },
    { multiplier: 30, timespan: 'minute', label: '30min' },
    { multiplier: 1, timespan: 'hour', label: '1hour' },
    { multiplier: 2, timespan: 'hour', label: '2hour' },
    { multiplier: 4, timespan: 'hour', label: '4hour' },
    { multiplier: 1, timespan: 'day', label: '1D' },
  ],

  // Time frame settings (period displayed)
  currentTimeFrame: { type: 'day', count: 5, text: '5D', title: 'View 5 days' },
  setCurrentTimeFrame: (timeFrame: TimeFrame) => set({ currentTimeFrame: timeFrame }),
  availableTimeFrames: [
    { type: 'day', count: 1, text: '1D', title: 'View 1 day' },
    { type: 'day', count: 5, text: '5D', title: 'View 5 days' },
    { type: 'day', count: 15, text: '15D', title: 'View 15 days' },
    { type: 'month', count: 1, text: '1M', title: 'View 1 month' },
    { type: 'month', count: 3, text: '3M', title: 'View 3 months' },
    { type: 'month', count: 6, text: '6M', title: 'View 6 months' },
    { type: 'ytd', count: 1, text: 'YTD', title: 'View year to date' },
    { type: 'year', count: 1, text: '1Y', title: 'View 1 year' },
    { type: 'all', count: 1, text: 'All', title: 'View all data' },
  ],

  // Indicator settings
  showUptickDowntick: false, // Default to off
  setShowUptickDowntick: (show: boolean) => set({ showUptickDowntick: show }),

  // Volume settings
  showVolume: true, // Default to on
  setShowVolume: (show: boolean) => set({ showVolume: show }),

  // Chart appearance settings
  showGrid: true, // Default to on
  setShowGrid: (show: boolean) => set({ showGrid: show }),

  // Candle style settings
  candleStyle: 'default' as 'default' | 'hollow' | 'colored',
  setCandleStyle: (style: 'default' | 'hollow' | 'colored') => set({ candleStyle: style }),

  // Chart color settings
  chartBackgroundColor: '#0a0a0a', // Default dark background
  setChartBackgroundColor: (color: string) => set({ chartBackgroundColor: color }),

  // Candlestick color settings
  upCandleColor: '#51a958', // Default green for bullish candles
  setUpCandleColor: (color: string) => set({ upCandleColor: color }),
  downCandleColor: '#ea3d3d', // Default red for bearish candles
  setDownCandleColor: (color: string) => set({ downCandleColor: color }),

  // Reset colors to defaults
  resetColors: () => set({
    chartBackgroundColor: '#0a0a0a',
    upCandleColor: '#51a958',
    downCandleColor: '#ea3d3d'
  }),
}));
