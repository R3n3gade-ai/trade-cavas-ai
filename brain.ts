// Mock implementation of the brain module
// This is a temporary solution until we have a real implementation

import { FlowItem } from './types';

// Mock data for options flow
const mockOptionsFlowData: FlowItem[] = [
  {
    time: '09:30:15',
    ticker: 'SPY',
    expiry: '06/21/24',
    callPut: 'C',
    spot: '450.32',
    strike: '455.00',
    otm: '1.04%',
    price: '3.45',
    size: 500,
    openInterest: '12,345',
    impliedVol: '18.5%',
    type: 'Sweep',
    premium: '172.5K',
    sector: 'ETF',
    heatScore: 7
  },
  {
    time: '09:32:22',
    ticker: 'AAPL',
    expiry: '07/19/24',
    callPut: 'P',
    spot: '175.88',
    strike: '170.00',
    otm: '3.34%',
    price: '2.75',
    size: 300,
    openInterest: '8,765',
    impliedVol: '22.3%',
    type: 'Block',
    premium: '82.5K',
    sector: 'Technology',
    heatScore: 5
  },
  {
    time: '09:35:47',
    ticker: 'MSFT',
    expiry: '06/28/24',
    callPut: 'C',
    spot: '420.15',
    strike: '425.00',
    otm: '1.15%',
    price: '5.20',
    size: 200,
    openInterest: '5,432',
    impliedVol: '19.8%',
    type: 'Sweep',
    premium: '104K',
    sector: 'Technology',
    heatScore: 6
  },
  {
    time: '09:40:12',
    ticker: 'NVDA',
    expiry: '07/05/24',
    callPut: 'C',
    spot: '950.75',
    strike: '1000.00',
    otm: '5.18%',
    price: '25.50',
    size: 100,
    openInterest: '3,210',
    impliedVol: '45.2%',
    type: 'Block',
    premium: '255K',
    sector: 'Technology',
    heatScore: 8
  },
  {
    time: '09:45:33',
    ticker: 'AMZN',
    expiry: '06/21/24',
    callPut: 'P',
    spot: '185.20',
    strike: '180.00',
    otm: '2.81%',
    price: '1.85',
    size: 400,
    openInterest: '9,876',
    impliedVol: '24.7%',
    type: 'Sweep',
    premium: '74K',
    sector: 'Consumer Cyclical',
    heatScore: 4
  },
  {
    time: '09:50:18',
    ticker: 'SPY',
    expiry: '07/19/24',
    callPut: 'C',
    spot: '450.45',
    strike: '460.00',
    otm: '2.12%',
    price: '2.95',
    size: 1000,
    openInterest: '25,678',
    impliedVol: '17.9%',
    type: 'Block',
    premium: '295K',
    sector: 'ETF',
    heatScore: 9
  },
  {
    time: '09:55:42',
    ticker: 'QQQ',
    expiry: '06/28/24',
    callPut: 'P',
    spot: '445.30',
    strike: '440.00',
    otm: '1.19%',
    price: '4.25',
    size: 500,
    openInterest: '15,432',
    impliedVol: '20.5%',
    type: 'Sweep',
    premium: '212.5K',
    sector: 'ETF',
    heatScore: 7
  },
  {
    time: '10:00:05',
    ticker: 'TSLA',
    expiry: '07/12/24',
    callPut: 'C',
    spot: '210.75',
    strike: '220.00',
    otm: '4.39%',
    price: '5.85',
    size: 300,
    openInterest: '12,345',
    impliedVol: '38.2%',
    type: 'Block',
    premium: '175.5K',
    sector: 'Consumer Cyclical',
    heatScore: 8
  },
  {
    time: '10:05:27',
    ticker: 'META',
    expiry: '06/21/24',
    callPut: 'P',
    spot: '495.60',
    strike: '490.00',
    otm: '1.13%',
    price: '6.75',
    size: 200,
    openInterest: '7,654',
    impliedVol: '25.8%',
    type: 'Sweep',
    premium: '135K',
    sector: 'Communication Services',
    heatScore: 6
  },
  {
    time: '10:10:39',
    ticker: 'SPY',
    expiry: '08/16/24',
    callPut: 'C',
    spot: '450.60',
    strike: '470.00',
    otm: '4.31%',
    price: '2.15',
    size: 2000,
    openInterest: '35,678',
    impliedVol: '16.5%',
    type: 'Block',
    premium: '430K',
    sector: 'ETF',
    heatScore: 9
  }
];

// Mock implementation of the brain module
const brain = {
  // Brain store methods
  add_to_brain: async (request: any) => {
    console.log('Mock add_to_brain called with:', request);
    return {
      json: async () => ({
        id: `brain-item-${Date.now()}`,
        timestamp: new Date().toISOString()
      })
    };
  },

  query_brain: async (request: any) => {
    console.log('Mock query_brain called with:', request);
    return {
      json: async () => ({
        results: [
          {
            id: 'mock-result-1',
            user_id: request.user_id,
            content: 'This is a mock brain item about trading strategies.',
            metadata: {},
            source: 'trading',
            timestamp: new Date().toISOString()
          },
          {
            id: 'mock-result-2',
            user_id: request.user_id,
            content: 'This is a mock brain item about market analysis.',
            metadata: {},
            source: 'research',
            timestamp: new Date().toISOString()
          }
        ]
      })
    };
  },

  add_to_brain2: async (request: any) => {
    console.log('Mock add_to_brain2 called with:', request);
    return {
      json: async () => ({
        id: `ted-brain-item-${Date.now()}`
      })
    };
  },

  query_brain2: async (request: any) => {
    console.log('Mock query_brain2 called with:', request);
    return {
      json: async () => ({
        results: [
          {
            id: 'mock-ted-result-1',
            content: 'This is a mock TED brain item about trading strategies.',
            metadata: {},
            score: 0.95
          },
          {
            id: 'mock-ted-result-2',
            content: 'This is a mock TED brain item about market analysis.',
            metadata: {},
            score: 0.85
          }
        ]
      })
    };
  },

  brain_store_status: async (request: any) => {
    console.log('Mock brain_store_status called with:', request);
    return {
      json: async () => ({
        status: 'active',
        item_count: 42
      })
    };
  },
  // Original brain functions
  list_categories: async ({ user_id }: { user_id: string }) => {
    // Return a mock response
    return {
      json: () => Promise.resolve({
        categories: [
          {
            id: "1",
            name: "Trading",
            description: "Store your trading charts, strategies, and market analysis.",
            icon: null,
            color: "bg-blue-500/10"
          },
          {
            id: "2",
            name: "Research",
            description: "Store your research and analysis.",
            icon: null,
            color: "bg-green-500/10"
          }
        ]
      })
    };
  },

  create_category: async (
    { user_id }: { user_id: string },
    category: { name: string; description: string; icon: any; color: any }
  ) => {
    // Return a mock response
    return {
      json: () => Promise.resolve({
        id: Math.random().toString(36).substring(7),
        ...category
      })
    };
  },

  // Mock function to get options flow data
  get_options_flow: async ({ symbol, min_premium, show_calls, show_puts, show_sweeps, show_blocks }: any) => {
    // Filter data based on parameters
    let filteredData = [...mockOptionsFlowData];

    // Filter by symbol if not ALL
    if (symbol !== 'ALL' && symbol !== 'ALL_TICKERS') {
      filteredData = filteredData.filter(item => item.ticker === symbol);
    }

    // Filter by premium
    if (min_premium > 0) {
      filteredData = filteredData.filter(item => {
        const premium = parseFloat(item.premium.replace('K', '000').replace('M', '000000'));
        return premium >= min_premium;
      });
    }

    // Filter by call/put
    if (!show_calls) {
      filteredData = filteredData.filter(item => item.callPut !== 'C');
    }

    if (!show_puts) {
      filteredData = filteredData.filter(item => item.callPut !== 'P');
    }

    // Filter by type
    if (!show_sweeps) {
      filteredData = filteredData.filter(item => item.type !== 'Sweep');
    }

    if (!show_blocks) {
      filteredData = filteredData.filter(item => item.type !== 'Block');
    }

    // Return mock response
    return {
      json: async () => ({
        data: filteredData,
        error: null
      })
    };
  },

  // Mock function to get options chain data
  get_options_chain: async ({ symbol }: any) => {
    // Return mock response
    return {
      json: async () => {
        // Generate mock options chain data
        const today = new Date();
        const expirations = [
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString().split('T')[0],
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21).toISOString().split('T')[0],
          new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toISOString().split('T')[0],
        ];

        // Base price based on symbol
        let basePrice = 450; // Default for SPY
        if (symbol === 'QQQ') basePrice = 445;
        if (symbol === 'AAPL') basePrice = 175;
        if (symbol === 'MSFT') basePrice = 420;
        if (symbol === 'GOOGL') basePrice = 175;
        if (symbol === 'AMZN') basePrice = 185;
        if (symbol === 'NVDA') basePrice = 950;

        // Generate strikes around the base price
        const strikes = [];
        for (let i = -5; i <= 5; i++) {
          strikes.push(Math.round(basePrice + (i * basePrice * 0.02)));
        }

        // Create chain structure
        const chain: any = {};

        // Populate chain with mock data
        expirations.forEach(exp => {
          chain[exp] = {
            calls: {},
            puts: {}
          };

          strikes.forEach(strike => {
            const strikeStr = strike.toString();
            const daysToExp = Math.round((new Date(exp).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const iv = 0.2 + (Math.random() * 0.1);

            // Generate mock option data
            chain[exp].calls[strikeStr] = createMockOption(symbol, strike, exp, 'call', basePrice, iv, daysToExp);
            chain[exp].puts[strikeStr] = createMockOption(symbol, strike, exp, 'put', basePrice, iv, daysToExp);
          });
        });

        return {
          symbol,
          expirations,
          strikes,
          underlyingPrice: basePrice,
          chain,
          error: null
        };
      }
    };
  }
};

// Helper to create mock option contracts
function createMockOption(
  symbol: string,
  strike: number,
  expDate: string,
  type: 'call' | 'put',
  underlyingPrice: number,
  iv: number,
  daysToExp: number
): any {
  const inTheMoney = type === 'call' ? strike < underlyingPrice : strike > underlyingPrice;
  const distanceFromStrike = Math.abs(strike - underlyingPrice) / underlyingPrice;

  // Calculate a somewhat realistic price based on ITM/OTM status
  let price = 0;
  if (inTheMoney) {
    price = type === 'call' ? underlyingPrice - strike : strike - underlyingPrice;
    price = Math.max(price, 0.1) + (iv * underlyingPrice * Math.sqrt(daysToExp / 365));
  } else {
    price = (iv * underlyingPrice * Math.sqrt(daysToExp / 365)) * Math.exp(-distanceFromStrike * 2);
    price = Math.max(price, 0.01);
  }

  const volume = Math.round(Math.random() * 1000) * (1 - distanceFromStrike);
  const openInterest = Math.round(volume * (2 + Math.random() * 8));

  return {
    id: `${symbol}-${expDate}-${type}-${strike}`,
    symbol: `${symbol}${expDate.replace(/-/g, '')}${type === 'call' ? 'C' : 'P'}${strike}`,
    name: `${symbol} ${expDate} ${strike} ${type.toUpperCase()}`,
    strike,
    expirationDate: expDate,
    contractType: type === 'call' ? 'call' : 'put',
    lastPrice: price,
    change: (Math.random() * 0.2 - 0.1) * price,
    bidPrice: price * 0.95,
    askPrice: price * 1.05,
    volume,
    openInterest,
    impliedVolatility: iv * 100, // Convert to percentage
    inTheMoney
  };
}

export default brain;
