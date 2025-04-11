import React from 'react';
import { Zap, TrendingUp, BarChart2, LineChart, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SampleQueryProps {
  onQuerySelect?: (query: string) => void;
}

export const TedAISampleQueries: React.FC<SampleQueryProps> = ({ onQuerySelect }) => {
  // Sample queries organized by category
  const sampleQueries = {
    marketAnalysis: [
      "What's happening in the market today?",
      "Analyze the technology sector performance",
      "How are small-cap stocks performing?",
      "What's the current market sentiment?",
    ],
    stockAnalysis: [
      "Analyze AAPL stock",
      "What do you think about NVDA right now?",
      "Compare MSFT and GOOGL performance",
      "Technical analysis of TSLA",
    ],
    optionsStrategies: [
      "Explain a covered call strategy",
      "What are the best options strategies in a volatile market?",
      "How do I analyze options flow data?",
      "Explain iron condor strategy",
    ],
    tradingStrategies: [
      "How to implement a swing trading strategy?",
      "Explain the MACD indicator",
      "What's a good risk management approach?",
      "How to identify support and resistance levels?",
    ],
  };

  // Handle query selection
  const handleQueryClick = (query: string) => {
    if (onQuerySelect) {
      onQuerySelect(query);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Try asking TED AI about:</h3>
      
      <div className="space-y-3">
        {/* Market Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-medium">Market Analysis</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.marketAnalysis.map((query, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs border-white/10 hover:bg-card"
                onClick={() => handleQueryClick(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Stock Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-medium">Stock Analysis</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.stockAnalysis.map((query, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs border-white/10 hover:bg-card"
                onClick={() => handleQueryClick(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Options Strategies */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-medium">Options Strategies</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.optionsStrategies.map((query, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs border-white/10 hover:bg-card"
                onClick={() => handleQueryClick(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Trading Strategies */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-medium">Trading Strategies</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.tradingStrategies.map((query, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs border-white/10 hover:bg-card"
                onClick={() => handleQueryClick(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TedAISampleQueries;
