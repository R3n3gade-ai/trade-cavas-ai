import { POLYGON_API_KEY } from '../config/api-keys';

// Types for dark pool data
export interface DarkPoolTrade {
  id: number;
  time: string;
  date: string;
  symbol: string;
  shares: string;
  price: string;
  value: string;
  type: string;
  exchange?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

export interface PriceLevel {
  price: string;
  volume: string;
  notional: string;
  percentage: string;
  spread: string;
  isHighlighted: boolean;
}

export interface DarkPoolLevels {
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  avgDailyVolume: string;
  date: string;
  levels: PriceLevel[];
}

export interface DarkPoolSummary {
  ticker: string;
  totalVolume: string;
  darkPoolPercentage: string;
  blockTradeCount: number;
  darkPoolCount: number;
  largestTrade: {
    value: string;
    shares: string;
    price: string;
    time: string;
    type: string;
  };
  volumeByExchange: {
    exchange: string;
    volume: string;
    percentage: string;
  }[];
  volumeByHour: {
    hour: string;
    volume: string;
    percentage: string;
  }[];
}

export interface DarkPoolHeatmap {
  ticker: string;
  date: string;
  heatmap: {
    price: string;
    volume: string;
    intensity: number; // 0-100 scale for heatmap intensity
  }[];
}

// Mock data for dark pool trades
const mockDarkPoolTrades: DarkPoolTrade[] = [
  { 
    id: 1, 
    time: "10:41:10", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "703,000", 
    price: "$142.42", 
    value: "$100M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  },
  { 
    id: 2, 
    time: "10:39:27", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "153,000", 
    price: "$142.40", 
    value: "$22M",
    type: "DARK",
    exchange: "NASDAQ",
    sentiment: "neutral"
  },
  { 
    id: 3, 
    time: "10:35:52", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "532,000", 
    price: "$142.38", 
    value: "$76M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  },
  { 
    id: 4, 
    time: "10:33:18", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "215,000", 
    price: "$142.42", 
    value: "$31M",
    type: "DARK",
    exchange: "CBOE",
    sentiment: "bearish"
  },
  { 
    id: 5, 
    time: "10:31:04", 
    date: "03/06/25",
    symbol: "MSFT", 
    shares: "300,000", 
    price: "$410.30", 
    value: "$123M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  },
  { 
    id: 6, 
    time: "10:29:42", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "265,000", 
    price: "$142.40", 
    value: "$38M",
    type: "DARK",
    exchange: "IEX",
    sentiment: "neutral"
  },
  { 
    id: 7, 
    time: "10:27:15", 
    date: "03/06/25",
    symbol: "NVDA", 
    shares: "420,000", 
    price: "$850.25", 
    value: "$357M",
    type: "BLOCK",
    exchange: "NASDAQ",
    sentiment: "bullish"
  },
  { 
    id: 8, 
    time: "10:25:03", 
    date: "03/06/25",
    symbol: "TSLA", 
    shares: "180,000", 
    price: "$175.30", 
    value: "$32M",
    type: "DARK",
    exchange: "CBOE",
    sentiment: "bearish"
  },
  { 
    id: 9, 
    time: "10:22:47", 
    date: "03/06/25",
    symbol: "AMZN", 
    shares: "250,000", 
    price: "$178.42", 
    value: "$45M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  },
  { 
    id: 10, 
    time: "10:20:31", 
    date: "03/06/25",
    symbol: "GOOGL", 
    shares: "175,000", 
    price: "$142.35", 
    value: "$25M",
    type: "DARK",
    exchange: "NASDAQ",
    sentiment: "neutral"
  },
  { 
    id: 11, 
    time: "10:18:22", 
    date: "03/06/25",
    symbol: "META", 
    shares: "320,000", 
    price: "$485.75", 
    value: "$155M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  },
  { 
    id: 12, 
    time: "10:16:09", 
    date: "03/06/25",
    symbol: "AAPL", 
    shares: "190,000", 
    price: "$142.38", 
    value: "$27M",
    type: "DARK",
    exchange: "IEX",
    sentiment: "bearish"
  },
  { 
    id: 13, 
    time: "10:14:55", 
    date: "03/06/25",
    symbol: "MSFT", 
    shares: "210,000", 
    price: "$410.25", 
    value: "$86M",
    type: "BLOCK",
    exchange: "NASDAQ",
    sentiment: "bullish"
  },
  { 
    id: 14, 
    time: "10:12:40", 
    date: "03/06/25",
    symbol: "NVDA", 
    shares: "150,000", 
    price: "$850.20", 
    value: "$128M",
    type: "DARK",
    exchange: "CBOE",
    sentiment: "neutral"
  },
  { 
    id: 15, 
    time: "10:10:28", 
    date: "03/06/25",
    symbol: "TSLA", 
    shares: "280,000", 
    price: "$175.28", 
    value: "$49M",
    type: "BLOCK",
    exchange: "NYSE",
    sentiment: "bullish"
  }
];

// Generate more mock data
for (let i = 16; i <= 100; i++) {
  const symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'AMD', 'INTC', 'JPM'];
  const types = ['DARK', 'BLOCK'];
  const exchanges = ['NYSE', 'NASDAQ', 'CBOE', 'IEX', 'ARCA'];
  const sentiments = ['bullish', 'bearish', 'neutral'] as const;
  
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  
  const shares = Math.floor(Math.random() * 900000 + 100000);
  const sharesFormatted = shares.toLocaleString();
  
  let price = 0;
  switch (symbol) {
    case 'AAPL': price = 142.40 + (Math.random() * 2 - 1); break;
    case 'MSFT': price = 410.30 + (Math.random() * 4 - 2); break;
    case 'NVDA': price = 850.25 + (Math.random() * 10 - 5); break;
    case 'TSLA': price = 175.30 + (Math.random() * 3 - 1.5); break;
    case 'AMZN': price = 178.42 + (Math.random() * 3 - 1.5); break;
    case 'GOOGL': price = 142.35 + (Math.random() * 2 - 1); break;
    case 'META': price = 485.75 + (Math.random() * 5 - 2.5); break;
    case 'AMD': price = 172.80 + (Math.random() * 3 - 1.5); break;
    case 'INTC': price = 43.25 + (Math.random() * 1 - 0.5); break;
    case 'JPM': price = 198.50 + (Math.random() * 2 - 1); break;
    default: price = 100 + (Math.random() * 10);
  }
  
  const priceFormatted = `$${price.toFixed(2)}`;
  const value = (shares * price) / 1000000; // Convert to millions
  let valueFormatted = '';
  
  if (value >= 1000) {
    valueFormatted = `$${(value / 1000).toFixed(1)}B`;
  } else {
    valueFormatted = `$${value.toFixed(1)}M`;
  }
  
  // Generate a random time between 9:30 AM and 4:00 PM
  const hour = Math.floor(Math.random() * 6.5) + 9;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  const timeFormatted = `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  
  // Generate a random date within the last 7 days
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  const dateFormatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
  
  mockDarkPoolTrades.push({
    id: i,
    time: timeFormatted,
    date: dateFormatted,
    symbol,
    shares: sharesFormatted,
    price: priceFormatted,
    value: valueFormatted,
    type,
    exchange,
    sentiment
  });
}

// Mock data for price levels
const mockPriceLevels: DarkPoolLevels = {
  ticker: "AAPL",
  price: "$142.42",
  change: "+0.87",
  changePercent: "+0.62%",
  avgDailyVolume: "45.2M",
  date: "03/06/25",
  levels: [
    {
      price: "142.42",
      volume: "3,650,000",
      notional: "$527M",
      percentage: "6.28%",
      spread: "30",
      isHighlighted: false
    },
    {
      price: "145.42",
      volume: "5,300,000",
      notional: "$844M",
      percentage: "11.52%",
      spread: "53",
      isHighlighted: true
    },
    {
      price: "145.07",
      volume: "2,520,000",
      notional: "$394M",
      percentage: "5.27%",
      spread: "25",
      isHighlighted: false
    },
    {
      price: "140.27",
      volume: "2,430,000",
      notional: "$341M",
      percentage: "5.25%",
      spread: "26",
      isHighlighted: false
    },
    {
      price: "144.18",
      volume: "2,070,000",
      notional: "$457M",
      percentage: "5.37%",
      spread: "30",
      isHighlighted: false
    },
    {
      price: "144.36",
      volume: "2,560,000",
      notional: "$577M",
      percentage: "6.27%",
      spread: "25",
      isHighlighted: false
    },
    {
      price: "143.79",
      volume: "3,980,000",
      notional: "$572M",
      percentage: "8.63%",
      spread: "37",
      isHighlighted: true
    },
    {
      price: "143.25",
      volume: "1,870,000",
      notional: "$268M",
      percentage: "4.05%",
      spread: "18",
      isHighlighted: false
    },
    {
      price: "142.98",
      volume: "2,240,000",
      notional: "$320M",
      percentage: "4.86%",
      spread: "22",
      isHighlighted: false
    },
    {
      price: "142.65",
      volume: "1,950,000",
      notional: "$278M",
      percentage: "4.23%",
      spread: "19",
      isHighlighted: false
    }
  ]
};

// Generate more price levels
for (let i = 0; i < 40; i++) {
  const basePrice = 140 + Math.random() * 10;
  const price = basePrice.toFixed(2);
  const volume = Math.floor(Math.random() * 4000000 + 1000000);
  const volumeFormatted = volume.toLocaleString();
  const notional = (volume * basePrice) / 1000000;
  const notionalFormatted = `$${notional.toFixed(0)}M`;
  const percentage = (Math.random() * 5 + 1).toFixed(2) + '%';
  const spread = Math.floor(Math.random() * 40 + 10).toString();
  const isHighlighted = Math.random() < 0.15; // 15% chance of being highlighted
  
  mockPriceLevels.levels.push({
    price,
    volume: volumeFormatted,
    notional: notionalFormatted,
    percentage,
    spread,
    isHighlighted
  });
}

// Mock data for dark pool summary
const mockDarkPoolSummary: DarkPoolSummary = {
  ticker: "AAPL",
  totalVolume: "45.2M",
  darkPoolPercentage: "38.7%",
  blockTradeCount: 28,
  darkPoolCount: 42,
  largestTrade: {
    value: "$123M",
    shares: "865,000",
    price: "$142.42",
    time: "10:41:10",
    type: "BLOCK"
  },
  volumeByExchange: [
    { exchange: "NYSE", volume: "12.5M", percentage: "27.7%" },
    { exchange: "NASDAQ", volume: "10.8M", percentage: "23.9%" },
    { exchange: "CBOE", volume: "8.7M", percentage: "19.2%" },
    { exchange: "IEX", volume: "7.2M", percentage: "15.9%" },
    { exchange: "ARCA", volume: "6.0M", percentage: "13.3%" }
  ],
  volumeByHour: [
    { hour: "9:30", volume: "5.2M", percentage: "11.5%" },
    { hour: "10:30", volume: "7.8M", percentage: "17.3%" },
    { hour: "11:30", volume: "6.5M", percentage: "14.4%" },
    { hour: "12:30", volume: "4.2M", percentage: "9.3%" },
    { hour: "13:30", volume: "5.1M", percentage: "11.3%" },
    { hour: "14:30", volume: "6.8M", percentage: "15.0%" },
    { hour: "15:30", volume: "9.6M", percentage: "21.2%" }
  ]
};

// Mock data for dark pool heatmap
const mockDarkPoolHeatmap: DarkPoolHeatmap = {
  ticker: "AAPL",
  date: "03/06/25",
  heatmap: []
};

// Generate heatmap data
for (let i = 0; i < 50; i++) {
  const basePrice = 140 + Math.random() * 10;
  const price = basePrice.toFixed(2);
  const volume = Math.floor(Math.random() * 4000000 + 100000);
  const volumeFormatted = volume.toLocaleString();
  const intensity = Math.floor(Math.random() * 100);
  
  mockDarkPoolHeatmap.heatmap.push({
    price,
    volume: volumeFormatted,
    intensity
  });
}

// Sort heatmap by price
mockDarkPoolHeatmap.heatmap.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

// Function to get dark pool trades
export async function getDarkPoolTrades(
  ticker: string = 'ALL',
  showDarkPool: boolean = true,
  showBlockTrades: boolean = true,
  minValue: number = 0,
  maxValue: number = 0,
  minShares: number = 0,
  maxShares: number = 0,
  lookbackDays: number = 7
): Promise<DarkPoolTrade[]> {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  
  // Filter by ticker
  let filteredTrades = [...mockDarkPoolTrades];
  if (ticker !== 'ALL') {
    filteredTrades = filteredTrades.filter(trade => trade.symbol === ticker);
  }
  
  // Filter by trade type
  if (!showDarkPool) {
    filteredTrades = filteredTrades.filter(trade => trade.type !== 'DARK');
  }
  
  if (!showBlockTrades) {
    filteredTrades = filteredTrades.filter(trade => trade.type !== 'BLOCK');
  }
  
  // Filter by value
  if (minValue > 0) {
    filteredTrades = filteredTrades.filter(trade => {
      const valueNum = parseFloat(trade.value.replace(/[^0-9.]/g, ''));
      const multiplier = trade.value.includes('M') ? 1000000 : 
                        trade.value.includes('K') ? 1000 : 
                        trade.value.includes('B') ? 1000000000 : 1;
      const actualValue = valueNum * multiplier;
      return actualValue >= minValue;
    });
  }
  
  if (maxValue > 0) {
    filteredTrades = filteredTrades.filter(trade => {
      const valueNum = parseFloat(trade.value.replace(/[^0-9.]/g, ''));
      const multiplier = trade.value.includes('M') ? 1000000 : 
                        trade.value.includes('K') ? 1000 : 
                        trade.value.includes('B') ? 1000000000 : 1;
      const actualValue = valueNum * multiplier;
      return actualValue <= maxValue;
    });
  }
  
  // Filter by shares
  if (minShares > 0) {
    filteredTrades = filteredTrades.filter(trade => {
      const sharesNum = parseInt(trade.shares.replace(/,/g, ''));
      return sharesNum >= minShares;
    });
  }
  
  if (maxShares > 0) {
    filteredTrades = filteredTrades.filter(trade => {
      const sharesNum = parseInt(trade.shares.replace(/,/g, ''));
      return sharesNum <= maxShares;
    });
  }
  
  // Filter by lookback days
  if (lookbackDays > 0) {
    const today = new Date();
    const lookbackDate = new Date(today);
    lookbackDate.setDate(lookbackDate.getDate() - lookbackDays);
    
    filteredTrades = filteredTrades.filter(trade => {
      const tradeDateParts = trade.date.split('/');
      const tradeDate = new Date(
        parseInt(`20${tradeDateParts[2]}`), 
        parseInt(tradeDateParts[0]) - 1, 
        parseInt(tradeDateParts[1])
      );
      return tradeDate >= lookbackDate;
    });
  }
  
  // Sort by time (most recent first)
  filteredTrades.sort((a, b) => {
    const aDateParts = a.date.split('/');
    const bDateParts = b.date.split('/');
    
    const aDate = new Date(
      parseInt(`20${aDateParts[2]}`), 
      parseInt(aDateParts[0]) - 1, 
      parseInt(aDateParts[1])
    );
    
    const bDate = new Date(
      parseInt(`20${bDateParts[2]}`), 
      parseInt(bDateParts[0]) - 1, 
      parseInt(bDateParts[1])
    );
    
    if (aDate.getTime() !== bDate.getTime()) {
      return bDate.getTime() - aDate.getTime();
    }
    
    // If dates are the same, sort by time
    const aTimeParts = a.time.split(':');
    const bTimeParts = b.time.split(':');
    
    const aTime = parseInt(aTimeParts[0]) * 3600 + parseInt(aTimeParts[1]) * 60 + parseInt(aTimeParts[2]);
    const bTime = parseInt(bTimeParts[0]) * 3600 + parseInt(bTimeParts[1]) * 60 + parseInt(bTimeParts[2]);
    
    return bTime - aTime;
  });
  
  return filteredTrades;
}

// Function to get price levels
export async function getPriceLevels(ticker: string = 'AAPL'): Promise<DarkPoolLevels> {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  
  // Return mock data with the requested ticker
  return {
    ...mockPriceLevels,
    ticker
  };
}

// Function to get dark pool summary
export async function getDarkPoolSummary(ticker: string = 'AAPL'): Promise<DarkPoolSummary> {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  
  // Return mock data with the requested ticker
  return {
    ...mockDarkPoolSummary,
    ticker
  };
}

// Function to get dark pool heatmap
export async function getDarkPoolHeatmap(ticker: string = 'AAPL'): Promise<DarkPoolHeatmap> {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  
  // Return mock data with the requested ticker
  return {
    ...mockDarkPoolHeatmap,
    ticker
  };
}
