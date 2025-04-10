import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getTickerDetails,
  getAggregates,
  getPreviousClose,
  getTrades,
  getQuotes,
  getSnapshotTicker,
  getSnapshotAllTickers,
  polygonWebSocket,
  PolygonTickerDetails,
  PolygonAggregatesResponse,
  PolygonPreviousClose,
  PolygonTradesResponse,
  PolygonQuotesResponse,
  PolygonSnapshot,
  PolygonSnapshotAllTickers
} from '../services/polygon-service';

// Types for the Polygon store
interface PolygonState {
  // Current ticker
  currentTicker: string;
  setCurrentTicker: (ticker: string) => void;
  
  // Ticker details
  tickerDetails: Record<string, PolygonTickerDetails>;
  fetchTickerDetails: (ticker: string) => Promise<PolygonTickerDetails>;
  
  // OHLC data
  ohlcData: Record<string, Record<string, PolygonAggregatesResponse>>;
  fetchOHLCData: (
    ticker: string,
    multiplier: number,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
    from: string,
    to: string,
    adjusted?: boolean
  ) => Promise<PolygonAggregatesResponse>;
  
  // Previous close
  previousCloseData: Record<string, PolygonPreviousClose>;
  fetchPreviousClose: (ticker: string, adjusted?: boolean) => Promise<PolygonPreviousClose>;
  
  // Trades
  tradesData: Record<string, PolygonTradesResponse>;
  fetchTrades: (ticker: string, limit?: number, timestamp?: string) => Promise<PolygonTradesResponse>;
  
  // Quotes
  quotesData: Record<string, PolygonQuotesResponse>;
  fetchQuotes: (ticker: string, limit?: number, timestamp?: string) => Promise<PolygonQuotesResponse>;
  
  // Snapshot
  snapshotData: Record<string, PolygonSnapshot>;
  fetchSnapshot: (ticker: string) => Promise<PolygonSnapshot>;
  
  // All tickers snapshot
  allTickersSnapshot: PolygonSnapshotAllTickers | null;
  fetchAllTickersSnapshot: () => Promise<PolygonSnapshotAllTickers>;
  
  // WebSocket
  isWebSocketConnected: boolean;
  subscribeToTicker: (ticker: string, channels: string[]) => void;
  unsubscribeFromTicker: (ticker: string, channels: string[]) => void;
  
  // Real-time data
  realtimeData: Record<string, any[]>;
  clearRealtimeData: (ticker: string) => void;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Create the Polygon store
export const usePolygonStore = create<PolygonState>()(
  persist(
    (set, get) => ({
      // Current ticker
      currentTicker: 'SPY',
      setCurrentTicker: (ticker: string) => {
        set({ currentTicker: ticker });
      },
      
      // Ticker details
      tickerDetails: {},
      fetchTickerDetails: async (ticker: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const details = await getTickerDetails(ticker);
          
          set(state => ({
            tickerDetails: {
              ...state.tickerDetails,
              [ticker]: details
            },
            isLoading: false
          }));
          
          return details;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch ticker details' 
          });
          throw error;
        }
      },
      
      // OHLC data
      ohlcData: {},
      fetchOHLCData: async (
        ticker: string,
        multiplier: number,
        timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
        from: string,
        to: string,
        adjusted: boolean = true
      ) => {
        try {
          set({ isLoading: true, error: null });
          
          const key = `${ticker}-${multiplier}-${timespan}-${from}-${to}-${adjusted}`;
          
          const data = await getAggregates(ticker, multiplier, timespan, from, to, adjusted);
          
          set(state => ({
            ohlcData: {
              ...state.ohlcData,
              [ticker]: {
                ...(state.ohlcData[ticker] || {}),
                [key]: data
              }
            },
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch OHLC data' 
          });
          throw error;
        }
      },
      
      // Previous close
      previousCloseData: {},
      fetchPreviousClose: async (ticker: string, adjusted: boolean = true) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await getPreviousClose(ticker, adjusted);
          
          set(state => ({
            previousCloseData: {
              ...state.previousCloseData,
              [ticker]: data
            },
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch previous close data' 
          });
          throw error;
        }
      },
      
      // Trades
      tradesData: {},
      fetchTrades: async (ticker: string, limit: number = 100, timestamp?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await getTrades(ticker, limit, timestamp);
          
          set(state => ({
            tradesData: {
              ...state.tradesData,
              [ticker]: data
            },
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch trades data' 
          });
          throw error;
        }
      },
      
      // Quotes
      quotesData: {},
      fetchQuotes: async (ticker: string, limit: number = 100, timestamp?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await getQuotes(ticker, limit, timestamp);
          
          set(state => ({
            quotesData: {
              ...state.quotesData,
              [ticker]: data
            },
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch quotes data' 
          });
          throw error;
        }
      },
      
      // Snapshot
      snapshotData: {},
      fetchSnapshot: async (ticker: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await getSnapshotTicker(ticker);
          
          set(state => ({
            snapshotData: {
              ...state.snapshotData,
              [ticker]: data
            },
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch snapshot data' 
          });
          throw error;
        }
      },
      
      // All tickers snapshot
      allTickersSnapshot: null,
      fetchAllTickersSnapshot: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await getSnapshotAllTickers();
          
          set({
            allTickersSnapshot: data,
            isLoading: false
          });
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch all tickers snapshot' 
          });
          throw error;
        }
      },
      
      // WebSocket
      isWebSocketConnected: false,
      subscribeToTicker: (ticker: string, channels: string[]) => {
        channels.forEach(channel => {
          const subscription = `${channel}.${ticker}`;
          polygonWebSocket.subscribe(subscription);
        });
      },
      unsubscribeFromTicker: (ticker: string, channels: string[]) => {
        channels.forEach(channel => {
          const subscription = `${channel}.${ticker}`;
          polygonWebSocket.unsubscribe(subscription);
        });
      },
      
      // Real-time data
      realtimeData: {},
      clearRealtimeData: (ticker: string) => {
        set(state => ({
          realtimeData: {
            ...state.realtimeData,
            [ticker]: []
          }
        }));
      },
      
      // Loading and error states
      isLoading: false,
      error: null,
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'polygon-store',
      partialize: (state) => ({
        currentTicker: state.currentTicker,
        tickerDetails: state.tickerDetails,
        ohlcData: state.ohlcData,
        previousCloseData: state.previousCloseData,
        snapshotData: state.snapshotData
      })
    }
  )
);

// Initialize WebSocket event handlers
polygonWebSocket.onConnect(() => {
  usePolygonStore.setState({ isWebSocketConnected: true });
});

polygonWebSocket.onDisconnect(() => {
  usePolygonStore.setState({ isWebSocketConnected: false });
});

polygonWebSocket.onMessage((data) => {
  // Process real-time data
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.ev && item.sym) {
        const ticker = item.sym;
        
        usePolygonStore.setState(state => ({
          realtimeData: {
            ...state.realtimeData,
            [ticker]: [
              ...(state.realtimeData[ticker] || []).slice(-99),
              item
            ]
          }
        }));
      }
    });
  }
});
