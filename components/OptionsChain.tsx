import React, { useState, useEffect } from 'react';
import { usePolygonStore } from '../utils/polygonStore';
import { Loader2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { format } from 'date-fns';

// Mock options data (in a real app, this would come from Polygon API)
interface OptionContract {
  strike: number;
  expiration: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  bid: number;
  ask: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  inTheMoney: boolean;
}

interface OptionsChainRow {
  strike: number;
  call: OptionContract;
  put: OptionContract;
}

interface OptionsChainProps {
  ticker: string;
  className?: string;
}

export function OptionsChain({ ticker, className = '' }: OptionsChainProps) {
  const { isLoading, error } = usePolygonStore();
  
  const [expirations, setExpirations] = useState<string[]>([]);
  const [selectedExpiration, setSelectedExpiration] = useState<string>('');
  const [optionsData, setOptionsData] = useState<OptionsChainRow[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [stockPrice, setStockPrice] = useState<number>(0);
  
  // Generate mock data for demonstration
  useEffect(() => {
    if (!ticker) return;
    
    // Simulate loading data
    const loadOptionsData = async () => {
      try {
        // In a real app, this would fetch from Polygon API
        
        // Generate mock expirations (next 4 Fridays)
        const mockExpirations = [];
        const today = new Date();
        let friday = new Date(today);
        
        // Find the next Friday
        friday.setDate(friday.getDate() + ((7 + 5 - friday.getDay()) % 7));
        
        for (let i = 0; i < 4; i++) {
          mockExpirations.push(format(friday, 'yyyy-MM-dd'));
          friday.setDate(friday.getDate() + 7);
        }
        
        setExpirations(mockExpirations);
        setSelectedExpiration(mockExpirations[0]);
        
        // Generate mock stock price
        const mockStockPrice = Math.round(Math.random() * 100 + 100);
        setStockPrice(mockStockPrice);
        
        // Generate mock options chain
        const mockOptionsChain: OptionsChainRow[] = [];
        
        // Generate strikes around the stock price
        for (let i = -10; i <= 10; i++) {
          const strike = Math.round(mockStockPrice + i * 5);
          
          // Calculate if in the money
          const callInTheMoney = strike < mockStockPrice;
          const putInTheMoney = strike > mockStockPrice;
          
          // Generate random values for the options
          const callLastPrice = Math.max(0.01, Number((callInTheMoney ? mockStockPrice - strike : Math.random() * 5).toFixed(2)));
          const putLastPrice = Math.max(0.01, Number((putInTheMoney ? strike - mockStockPrice : Math.random() * 5).toFixed(2)));
          
          mockOptionsChain.push({
            strike,
            call: {
              strike,
              expiration: mockExpirations[0],
              lastPrice: callLastPrice,
              change: Number((Math.random() * 2 - 1).toFixed(2)),
              changePercent: Number((Math.random() * 10 - 5).toFixed(2)),
              volume: Math.floor(Math.random() * 1000),
              openInterest: Math.floor(Math.random() * 5000),
              bid: Number((callLastPrice - Math.random()).toFixed(2)),
              ask: Number((callLastPrice + Math.random()).toFixed(2)),
              impliedVolatility: Number((Math.random() * 0.5 + 0.2).toFixed(2)),
              delta: Number((callInTheMoney ? 0.5 + Math.random() * 0.5 : Math.random() * 0.5).toFixed(2)),
              gamma: Number((Math.random() * 0.05).toFixed(3)),
              theta: Number((-Math.random() * 0.2).toFixed(3)),
              vega: Number((Math.random() * 0.2).toFixed(3)),
              inTheMoney: callInTheMoney
            },
            put: {
              strike,
              expiration: mockExpirations[0],
              lastPrice: putLastPrice,
              change: Number((Math.random() * 2 - 1).toFixed(2)),
              changePercent: Number((Math.random() * 10 - 5).toFixed(2)),
              volume: Math.floor(Math.random() * 1000),
              openInterest: Math.floor(Math.random() * 5000),
              bid: Number((putLastPrice - Math.random()).toFixed(2)),
              ask: Number((putLastPrice + Math.random()).toFixed(2)),
              impliedVolatility: Number((Math.random() * 0.5 + 0.2).toFixed(2)),
              delta: Number((putInTheMoney ? -0.5 - Math.random() * 0.5 : -Math.random() * 0.5).toFixed(2)),
              gamma: Number((Math.random() * 0.05).toFixed(3)),
              theta: Number((-Math.random() * 0.2).toFixed(3)),
              vega: Number((Math.random() * 0.2).toFixed(3)),
              inTheMoney: putInTheMoney
            }
          });
        }
        
        setOptionsData(mockOptionsChain);
      } catch (err) {
        console.error('Error loading options data:', err);
      }
    };
    
    loadOptionsData();
  }, [ticker]);
  
  // Handle expiration change
  const handleExpirationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExpiration(e.target.value);
    // In a real app, this would fetch new data for the selected expiration
  };
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Apply sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) {
      return optionsData;
    }
    
    return [...optionsData].sort((a, b) => {
      // Extract the value based on the sort key
      let aValue, bValue;
      
      if (sortConfig.key === 'strike') {
        aValue = a.strike;
        bValue = b.strike;
      } else if (sortConfig.key.startsWith('call.')) {
        const callKey = sortConfig.key.replace('call.', '') as keyof OptionContract;
        aValue = a.call[callKey];
        bValue = b.call[callKey];
      } else if (sortConfig.key.startsWith('put.')) {
        const putKey = sortConfig.key.replace('put.', '') as keyof OptionContract;
        aValue = a.put[putKey];
        bValue = b.put[putKey];
      } else {
        return 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [optionsData, sortConfig]);
  
  // Render sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline-block ml-1" />
    );
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading options data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-medium">{ticker} Options Chain</h3>
          <p className="text-sm text-muted-foreground">
            Current Price: <span className="font-medium">${stockPrice.toFixed(2)}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="expiration" className="block text-sm font-medium mb-1">
              Expiration
            </label>
            <select
              id="expiration"
              value={selectedExpiration}
              onChange={handleExpirationChange}
              className="bg-background border border-white/10 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {expirations.map(exp => (
                <option key={exp} value={exp}>
                  {format(new Date(exp), 'MMM d, yyyy')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mr-1" />
            <span>Highlighted rows are in-the-money</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-card/50 text-xs">
              <th colSpan={7} className="px-2 py-2 text-center border-b border-white/10 text-primary">
                Calls
              </th>
              <th
                className="px-2 py-2 text-center border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('strike')}
              >
                Strike {getSortIndicator('strike')}
              </th>
              <th colSpan={7} className="px-2 py-2 text-center border-b border-white/10 text-primary">
                Puts
              </th>
            </tr>
            <tr className="bg-card/50 text-xs">
              {/* Call columns */}
              <th
                className="px-2 py-2 text-left border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.lastPrice')}
              >
                Last {getSortIndicator('call.lastPrice')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.change')}
              >
                Chg {getSortIndicator('call.change')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.bid')}
              >
                Bid {getSortIndicator('call.bid')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.ask')}
              >
                Ask {getSortIndicator('call.ask')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.volume')}
              >
                Vol {getSortIndicator('call.volume')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.openInterest')}
              >
                OI {getSortIndicator('call.openInterest')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('call.impliedVolatility')}
              >
                IV {getSortIndicator('call.impliedVolatility')}
              </th>
              
              {/* Strike column */}
              <th className="px-2 py-2 text-center border-b border-white/10 bg-background/50 font-medium">
                ${stockPrice.toFixed(2)}
              </th>
              
              {/* Put columns */}
              <th
                className="px-2 py-2 text-left border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.lastPrice')}
              >
                Last {getSortIndicator('put.lastPrice')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.change')}
              >
                Chg {getSortIndicator('put.change')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.bid')}
              >
                Bid {getSortIndicator('put.bid')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.ask')}
              >
                Ask {getSortIndicator('put.ask')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.volume')}
              >
                Vol {getSortIndicator('put.volume')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.openInterest')}
              >
                OI {getSortIndicator('put.openInterest')}
              </th>
              <th
                className="px-2 py-2 text-right border-b border-white/10 cursor-pointer"
                onClick={() => requestSort('put.impliedVolatility')}
              >
                IV {getSortIndicator('put.impliedVolatility')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`text-xs hover:bg-accent/10 ${
                  row.strike === stockPrice ? 'bg-primary/5' : ''
                }`}
              >
                {/* Call data */}
                <td
                  className={`px-2 py-1.5 text-left border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.call.lastPrice.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  } ${row.call.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {row.call.change >= 0 ? '+' : ''}
                  {row.call.change.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.call.bid.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.call.ask.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {row.call.volume.toLocaleString()}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {row.call.openInterest.toLocaleString()}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.call.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {(row.call.impliedVolatility * 100).toFixed(1)}%
                </td>
                
                {/* Strike */}
                <td className="px-2 py-1.5 text-center border-b border-white/5 font-medium bg-background/30">
                  ${row.strike.toFixed(2)}
                </td>
                
                {/* Put data */}
                <td
                  className={`px-2 py-1.5 text-left border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.put.lastPrice.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  } ${row.put.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {row.put.change >= 0 ? '+' : ''}
                  {row.put.change.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.put.bid.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  ${row.put.ask.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {row.put.volume.toLocaleString()}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {row.put.openInterest.toLocaleString()}
                </td>
                <td
                  className={`px-2 py-1.5 text-right border-b border-white/5 ${
                    row.put.inTheMoney ? 'bg-green-500/10' : ''
                  }`}
                >
                  {(row.put.impliedVolatility * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          Note: This is simulated options data for demonstration purposes. In a production environment,
          this would use real-time data from the Polygon API.
        </p>
      </div>
    </div>
  );
}
