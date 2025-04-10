import { POLYGON_API_KEY } from '../config/api-keys';

// Types for Polygon API responses
export interface PolygonTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  last_updated_utc: string;
}

export interface PolygonTickerDetails extends PolygonTicker {
  market_cap: number;
  phone_number: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postal_code: string;
  };
  description: string;
  sic_code: string;
  sic_description: string;
  ticker_root: string;
  homepage_url: string;
  total_employees: number;
  list_date: string;
  branding: {
    logo_url: string;
    icon_url: string;
  };
  share_class_shares_outstanding: number;
  weighted_shares_outstanding: number;
}

export interface PolygonAggregateBar {
  c: number; // close
  h: number; // high
  l: number; // low
  n: number; // number of transactions
  o: number; // open
  t: number; // timestamp
  v: number; // volume
  vw: number; // volume weighted average price
}

export interface PolygonAggregatesResponse {
  ticker: string;
  status: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonAggregateBar[];
  request_id: string;
  count: number;
}

export interface PolygonPreviousClose {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonAggregateBar[];
  status: string;
  request_id: string;
  count: number;
}

export interface PolygonTrade {
  conditions: number[];
  exchange: number;
  id: string;
  participant_timestamp: number;
  price: number;
  sequence_number: number;
  sip_timestamp: number;
  size: number;
  tape: number;
}

export interface PolygonTradesResponse {
  ticker: string;
  status: string;
  queryCount: number;
  resultsCount: number;
  results: PolygonTrade[];
  request_id: string;
  count: number;
}

export interface PolygonQuote {
  ask_exchange: number;
  ask_price: number;
  ask_size: number;
  bid_exchange: number;
  bid_price: number;
  bid_size: number;
  conditions: number[];
  participant_timestamp: number;
  sequence_number: number;
  sip_timestamp: number;
  tape: number;
}

export interface PolygonQuotesResponse {
  ticker: string;
  status: string;
  queryCount: number;
  resultsCount: number;
  results: PolygonQuote[];
  request_id: string;
  count: number;
}

export interface PolygonSnapshot {
  ticker: string;
  day: {
    c: number;
    h: number;
    l: number;
    o: number;
    v: number;
    vw: number;
  };
  lastTrade: {
    c: number[];
    i: string;
    p: number;
    s: number;
    t: number;
    x: number;
  };
  lastQuote: {
    P: number;
    S: number;
    p: number;
    s: number;
    t: number;
  };
  min: {
    av: number;
    c: number;
    h: number;
    l: number;
    o: number;
    v: number;
    vw: number;
  };
  prevDay: {
    c: number;
    h: number;
    l: number;
    o: number;
    v: number;
    vw: number;
  };
  todaysChange: number;
  todaysChangePerc: number;
  updated: number;
}

export interface PolygonSnapshotAllTickers {
  status: string;
  tickers: PolygonSnapshot[];
}

// Function to check if the Polygon API key is configured
export function isPolygonConfigured(): boolean {
  return !!POLYGON_API_KEY;
}

// For development, we'll use mock data if the API key is not configured
const USE_MOCK_DATA = true; // Set to false to use real API

// Mock data for development
const mockData = {
  ticker: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    market: 'stocks',
    locale: 'us',
    primary_exchange: 'NASDAQ',
    type: 'CS',
    active: true,
    currency_name: 'usd',
    cik: '0000320193',
    composite_figi: 'BBG000B9XRY4',
    share_class_figi: 'BBG001S5N8V8',
    market_cap: 2750000000000,
    phone_number: '14089961010',
    address: {
      address1: 'One Apple Park Way',
      city: 'Cupertino',
      state: 'CA',
      postal_code: '95014'
    },
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sic_code: '3571',
    sic_description: 'Electronic Computers',
    ticker_root: 'AAPL',
    homepage_url: 'https://www.apple.com',
    total_employees: 154000,
    list_date: '1980-12-12',
    branding: {
      logo_url: 'https://api.polygon.io/v1/reference/company-branding/d3d3LmFwcGxlLmNvbQ/images/2023-01-01_logo.svg',
      icon_url: 'https://api.polygon.io/v1/reference/company-branding/d3d3LmFwcGxlLmNvbQ/images/2023-01-01_icon.png'
    },
    share_class_shares_outstanding: 15634232000,
    weighted_shares_outstanding: 15634232000
  },
  aggregates: {
    ticker: 'AAPL',
    status: 'OK',
    adjusted: true,
    queryCount: 1,
    resultsCount: 30,
    request_id: 'mock-request',
    results: Array(30).fill(0).map((_, i) => ({
      c: 180 + Math.random() * 20,
      h: 185 + Math.random() * 20,
      l: 175 + Math.random() * 20,
      o: 178 + Math.random() * 20,
      t: new Date(2023, 0, i + 1).getTime(),
      v: 10000000 + Math.random() * 5000000,
      vw: 180 + Math.random() * 20,
      n: 10000
    })),
    count: 30
  },
  previousClose: {
    ticker: 'AAPL',
    queryCount: 1,
    resultsCount: 1,
    adjusted: true,
    results: [{
      c: 190.5,
      h: 193.2,
      l: 188.7,
      o: 189.3,
      t: new Date().getTime() - 86400000,
      v: 15000000,
      vw: 190.2,
      n: 12000
    }],
    status: 'OK',
    request_id: 'mock-request',
    count: 1
  },
  trades: {
    ticker: 'AAPL',
    status: 'OK',
    queryCount: 1,
    resultsCount: 10,
    results: Array(10).fill(0).map((_, i) => ({
      conditions: [1],
      exchange: 2,
      id: `mock-trade-${i}`,
      participant_timestamp: new Date().getTime() - i * 1000,
      price: 190 + Math.random() * 2,
      sequence_number: i,
      sip_timestamp: new Date().getTime() - i * 1000,
      size: 100 + Math.floor(Math.random() * 900),
      tape: 1
    })),
    request_id: 'mock-request',
    count: 10
  },
  quotes: {
    ticker: 'AAPL',
    status: 'OK',
    queryCount: 1,
    resultsCount: 10,
    results: Array(10).fill(0).map((_, i) => ({
      ask_exchange: 2,
      ask_price: 190.5 + Math.random() * 0.5,
      ask_size: 100 + Math.floor(Math.random() * 900),
      bid_exchange: 3,
      bid_price: 190 - Math.random() * 0.5,
      bid_size: 100 + Math.floor(Math.random() * 900),
      conditions: [1],
      participant_timestamp: new Date().getTime() - i * 1000,
      sequence_number: i,
      sip_timestamp: new Date().getTime() - i * 1000,
      tape: 1
    })),
    request_id: 'mock-request',
    count: 10
  },
  snapshot: {
    ticker: 'AAPL',
    day: {
      c: 190.5,
      h: 193.2,
      l: 188.7,
      o: 189.3,
      v: 15000000,
      vw: 190.2
    },
    lastTrade: {
      c: [1],
      i: 'mock-trade',
      p: 190.5,
      s: 100,
      t: new Date().getTime(),
      x: 2
    },
    lastQuote: {
      P: 190.6,
      S: 200,
      p: 190.4,
      s: 300,
      t: new Date().getTime()
    },
    min: {
      av: 1000000,
      c: 190.5,
      h: 190.8,
      l: 190.2,
      o: 190.3,
      v: 50000,
      vw: 190.5
    },
    prevDay: {
      c: 189.5,
      h: 191.2,
      l: 188.7,
      o: 190.3,
      v: 14000000,
      vw: 189.8
    },
    todaysChange: 1.0,
    todaysChangePerc: 0.53,
    updated: new Date().getTime()
  },
  snapshotAllTickers: {
    status: 'OK',
    tickers: [
      // Mock data for SPY
      {
        ticker: 'SPY',
        day: {
          c: 450.5,
          h: 453.2,
          l: 448.7,
          o: 449.3,
          v: 50000000,
          vw: 450.2
        },
        lastTrade: {
          c: [1],
          i: 'mock-trade',
          p: 450.5,
          s: 100,
          t: new Date().getTime(),
          x: 2
        },
        lastQuote: {
          P: 450.6,
          S: 200,
          p: 450.4,
          s: 300,
          t: new Date().getTime()
        },
        min: {
          av: 3000000,
          c: 450.5,
          h: 450.8,
          l: 450.2,
          o: 450.3,
          v: 150000,
          vw: 450.5
        },
        prevDay: {
          c: 449.5,
          h: 451.2,
          l: 448.7,
          o: 450.3,
          v: 45000000,
          vw: 449.8
        },
        todaysChange: 1.0,
        todaysChangePerc: 0.22,
        updated: new Date().getTime()
      },
      // Mock data for AAPL
      {
        ticker: 'AAPL',
        day: {
          c: 190.5,
          h: 193.2,
          l: 188.7,
          o: 189.3,
          v: 15000000,
          vw: 190.2
        },
        lastTrade: {
          c: [1],
          i: 'mock-trade',
          p: 190.5,
          s: 100,
          t: new Date().getTime(),
          x: 2
        },
        lastQuote: {
          P: 190.6,
          S: 200,
          p: 190.4,
          s: 300,
          t: new Date().getTime()
        },
        min: {
          av: 1000000,
          c: 190.5,
          h: 190.8,
          l: 190.2,
          o: 190.3,
          v: 50000,
          vw: 190.5
        },
        prevDay: {
          c: 189.5,
          h: 191.2,
          l: 188.7,
          o: 190.3,
          v: 14000000,
          vw: 189.8
        },
        todaysChange: 1.0,
        todaysChangePerc: 0.53,
        updated: new Date().getTime()
      }
    ]
  }
};

// Base function for making Polygon API requests
async function polygonRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Use mock data if configured or if API key is not available
  if (USE_MOCK_DATA || !isPolygonConfigured()) {
    console.log(`Using mock data for endpoint: ${endpoint}`);

    // Return appropriate mock data based on the endpoint
    if (endpoint.includes('/v3/reference/tickers/')) {
      return mockData.ticker as unknown as T;
    } else if (endpoint.includes('/v2/aggs/ticker/') && endpoint.includes('/range/')) {
      return mockData.aggregates as unknown as T;
    } else if (endpoint.includes('/v2/aggs/ticker/') && endpoint.includes('/prev')) {
      return mockData.previousClose as unknown as T;
    } else if (endpoint.includes('/v3/trades/')) {
      return mockData.trades as unknown as T;
    } else if (endpoint.includes('/v3/quotes/')) {
      return mockData.quotes as unknown as T;
    } else if (endpoint.includes('/v2/snapshot/locale/us/markets/stocks/tickers') && !endpoint.includes('tickers/')) {
      return mockData.snapshotAllTickers as unknown as T;
    } else if (endpoint.includes('/v2/snapshot/locale/us/markets/stocks/tickers/')) {
      return { ticker: mockData.snapshot } as unknown as T;
    }

    // Default fallback
    return {} as T;
  }

  // Real API request logic
  // Add API key to params
  const queryParams = new URLSearchParams({
    ...params,
    apiKey: POLYGON_API_KEY
  });

  const url = `https://api.polygon.io${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Polygon API request failed: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error('Error making Polygon API request:', error);
    throw error;
  }
}

// Function to get ticker details
export async function getTickerDetails(ticker: string): Promise<PolygonTickerDetails> {
  return polygonRequest<PolygonTickerDetails>(`/v3/reference/tickers/${ticker}`);
}

// Function to get aggregates (OHLC bars)
export async function getAggregates(
  ticker: string,
  multiplier: number,
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
  from: string,
  to: string,
  adjusted: boolean = true
): Promise<PolygonAggregatesResponse> {
  return polygonRequest<PolygonAggregatesResponse>(
    `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`,
    { adjusted: adjusted.toString() }
  );
}

// Function to get previous close
export async function getPreviousClose(ticker: string, adjusted: boolean = true): Promise<PolygonPreviousClose> {
  return polygonRequest<PolygonPreviousClose>(
    `/v2/aggs/ticker/${ticker}/prev`,
    { adjusted: adjusted.toString() }
  );
}

// Function to get trades
export async function getTrades(
  ticker: string,
  limit: number = 100,
  timestamp?: string
): Promise<PolygonTradesResponse> {
  const params: Record<string, string> = { limit: limit.toString() };
  if (timestamp) {
    params.timestamp = timestamp;
  }
  return polygonRequest<PolygonTradesResponse>(`/v3/trades/${ticker}`, params);
}

// Function to get quotes
export async function getQuotes(
  ticker: string,
  limit: number = 100,
  timestamp?: string
): Promise<PolygonQuotesResponse> {
  const params: Record<string, string> = { limit: limit.toString() };
  if (timestamp) {
    params.timestamp = timestamp;
  }
  return polygonRequest<PolygonQuotesResponse>(`/v3/quotes/${ticker}`, params);
}

// Function to get snapshot for all tickers
export async function getSnapshotAllTickers(): Promise<PolygonSnapshotAllTickers> {
  return polygonRequest<PolygonSnapshotAllTickers>('/v2/snapshot/locale/us/markets/stocks/tickers');
}

// Function to get snapshot for a specific ticker
export async function getSnapshotTicker(ticker: string): Promise<PolygonSnapshot> {
  const response = await polygonRequest<{ ticker: PolygonSnapshot }>(`/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`);
  return response.ticker;
}

// Mock WebSocket connection for real-time data
export class PolygonWebSocket {
  private subscriptions: Set<string> = new Set();
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: Event) => void) | null = null;
  private connected: boolean = false;
  private mockDataInterval: number | null = null;

  constructor() {
    // Simulate connection
    setTimeout(() => {
      this.connected = true;
      if (this.onConnectCallback) {
        this.onConnectCallback();
      }
      this.startMockDataStream();
    }, 1000);
  }

  private startMockDataStream(): void {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
    }

    // Send mock data every 5 seconds
    this.mockDataInterval = window.setInterval(() => {
      if (this.onMessageCallback && this.subscriptions.size > 0) {
        // Generate mock trade data for each subscription
        Array.from(this.subscriptions).forEach(subscription => {
          const parts = subscription.split('.');
          const channel = parts[0];
          const symbol = parts[1];

          if (channel === 'T') {
            // Mock trade data
            const mockTrade = {
              ev: 'T',
              sym: symbol,
              p: Math.round((Math.random() * 10 + 100) * 100) / 100, // Random price
              s: Math.floor(Math.random() * 1000) + 1, // Random size
              t: Date.now(),
              c: [0],
              x: 4
            };
            this.onMessageCallback([mockTrade]);
          } else if (channel === 'Q') {
            // Mock quote data
            const basePrice = Math.round((Math.random() * 10 + 100) * 100) / 100;
            const mockQuote = {
              ev: 'Q',
              sym: symbol,
              bp: basePrice - 0.05, // Bid price
              bs: Math.floor(Math.random() * 500) + 1, // Bid size
              ap: basePrice + 0.05, // Ask price
              as: Math.floor(Math.random() * 500) + 1, // Ask size
              t: Date.now(),
              c: [0],
              x: 4
            };
            this.onMessageCallback([mockQuote]);
          } else if (channel === 'AM') {
            // Mock minute bar data
            const basePrice = Math.round((Math.random() * 10 + 100) * 100) / 100;
            const mockBar = {
              ev: 'AM',
              sym: symbol,
              o: basePrice - 0.2, // Open
              h: basePrice + 0.3, // High
              l: basePrice - 0.3, // Low
              c: basePrice + 0.1, // Close
              v: Math.floor(Math.random() * 10000) + 1000, // Volume
              s: Date.now() - 60000, // Start time
              e: Date.now() // End time
            };
            this.onMessageCallback([mockBar]);
          }
        });
      }
    }, 5000);
  }

  public subscribe(channel: string): void {
    this.subscriptions.add(channel);
    console.log(`Subscribed to ${channel}`);
  }

  public unsubscribe(channel: string): void {
    this.subscriptions.delete(channel);
    console.log(`Unsubscribed from ${channel}`);
  }

  public onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
    if (this.connected && callback) {
      callback();
    }
  }

  public onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  public onError(callback: (error: Event) => void): void {
    this.onErrorCallback = callback;
  }

  public close(): void {
    this.connected = false;
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback();
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

// Create a singleton instance of the WebSocket connection
export const polygonWebSocket = new PolygonWebSocket();
