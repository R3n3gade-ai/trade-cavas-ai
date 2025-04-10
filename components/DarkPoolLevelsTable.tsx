import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useDarkPoolStore } from '../utils/darkPoolStore';

export const DarkPoolLevelsTable: React.FC = () => {
  const { 
    getDisplayLevels, 
    getTotalLevelsPages,
    currentLevelsPage,
    setCurrentLevelsPage,
    priceLevels,
    isLoading
  } = useDarkPoolStore();
  
  const displayLevels = getDisplayLevels();
  const totalPages = getTotalLevelsPages();
  
  // Function to render pagination
  const renderPagination = () => {
    const pageButtons = [];
    
    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={() => setCurrentLevelsPage(Math.max(1, currentLevelsPage - 1))}
        disabled={currentLevelsPage === 1}
        className={`px-3 py-2 rounded border border-white/10 ${currentLevelsPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
    
    // Logic for which page buttons to show
    let startPage = Math.max(1, currentLevelsPage - 2);
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
          onClick={() => setCurrentLevelsPage(i)}
          className={`px-3 py-2 rounded ${i === currentLevelsPage ? 'bg-primary text-white' : 'border border-white/10 hover:bg-white/5'}`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={() => setCurrentLevelsPage(Math.min(totalPages, currentLevelsPage + 1))}
        disabled={currentLevelsPage === totalPages}
        className={`px-3 py-2 rounded border border-white/10 ${currentLevelsPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );
    
    return pageButtons;
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Price Levels Header */}
      {priceLevels && (
        <div className="bg-background/40 p-4 border-b border-white/10">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{priceLevels.ticker}</span>
              <span className="text-2xl font-bold">{priceLevels.price}</span>
              <span className={`text-sm font-medium ${priceLevels.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {priceLevels.change} ({priceLevels.changePercent})
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Avg Volume</span>
                <div className="text-sm font-medium">{priceLevels.avgDailyVolume}</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Date</span>
                <div className="text-sm font-medium">{priceLevels.date}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto flex-grow overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-background/50">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-medium">PRICE</th>
              <th className="px-4 py-3 text-left font-medium">VOLUME</th>
              <th className="px-4 py-3 text-left font-medium">NOTIONAL VALUE</th>
              <th className="px-4 py-3 text-left font-medium">% OF VOL</th>
              <th className="px-4 py-3 text-left font-medium">SPREAD</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : displayLevels.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No price levels found.
                </td>
              </tr>
            ) : (
              displayLevels.map((level, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-white/5 transition-colors ${level.isHighlighted ? 'bg-indigo-900/30' : 'hover:bg-background/30'}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {level.isHighlighted && <Zap className="inline-block h-3 w-3 mr-1 text-indigo-400" />}
                    ${level.price}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{level.volume}</td>
                  <td className="px-4 py-3 font-medium">{level.notional}</td>
                  <td className="px-4 py-3 text-muted-foreground">{level.percentage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{level.spread}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {displayLevels.length > 0 && (
        <div className="flex justify-center items-center p-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};
