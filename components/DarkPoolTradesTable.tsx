import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useDarkPoolStore } from '../utils/darkPoolStore';

export const DarkPoolTradesTable: React.FC = () => {
  const { 
    getDisplayTrades, 
    getTotalPages,
    currentPage,
    setCurrentPage,
    selectedTicker,
    setSelectedTicker,
    isLoading
  } = useDarkPoolStore();
  
  const displayData = getDisplayTrades();
  const totalPages = getTotalPages();
  
  // Function to render pagination
  const renderPagination = () => {
    const pageButtons = [];
    
    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded border border-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
    
    // Logic for which page buttons to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 rounded ${i === currentPage ? 'bg-primary text-white' : 'border border-white/10 hover:bg-white/5'}`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded border border-white/10 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );
    
    return pageButtons;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-background/50">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Symbol</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shares</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exchange</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No dark pool trades found matching your criteria.
                </td>
              </tr>
            ) : (
              displayData.map((item) => {
                // Parse the value to determine if it's a high-value trade (over $100M)
                const valueString = item.value;
                const numericValue = parseFloat(valueString.replace(/[^0-9.]/g, ''));
                const isMillions = valueString.includes('M');
                const isBillions = valueString.includes('B');
                
                // Calculate actual value in millions
                const valueInMillions = isMillions ? numericValue : 
                                       isBillions ? numericValue * 1000 : 
                                       numericValue / 1000000;
                
                // Flag for high-value trades (over $100M)
                const isHighValueTrade = valueInMillions >= 100;
                
                return (
                  <tr 
                    key={item.id} 
                    className={`border-b border-white/5 hover:bg-background/30 transition-colors ${isHighValueTrade ? 'bg-green-900/20' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{item.time}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedTicker(item.symbol)}
                        className={`font-medium ${selectedTicker === item.symbol ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                      >
                        {item.symbol}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{item.shares}</td>
                    <td className="px-4 py-3 font-mono text-xs">{item.price}</td>
                    <td className={`px-4 py-3 font-mono text-xs ${isHighValueTrade ? 'text-green-400 font-semibold' : ''}`}>
                      {isHighValueTrade && <Zap className="inline-block h-3 w-3 mr-1 text-green-400" />}
                      {item.value}
                    </td>
                    <td className={`px-4 py-3 text-xs ${item.type === 'BLOCK' ? 'text-blue-400' : 'text-purple-400'}`}>
                      {item.type}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.exchange}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {displayData.length > 0 && (
        <div className="flex justify-center items-center p-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};
