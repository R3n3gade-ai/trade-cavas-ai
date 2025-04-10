// Mock implementation of the brain API for development
const mockBrain = {
  // Mock response for brain_store_status
  brain_store_status: async () => {
    return {
      json: async () => ({
        total_items: 15,
        sources: {
          "chart-data": 5,
          "article": 3,
          "user-input": 4,
          "document": 3
        },
        size_kb: 25.5,
        last_added: new Date().toISOString()
      })
    };
  },
  
  // Mock response for query_brain2
  query_brain2: async () => {
    return {
      json: async () => ({
        results: [
          {
            id: "1",
            content: "SPY showed a bullish divergence pattern on the 4-hour chart",
            source: "chart-data",
            metadata: {
              symbol: "SPY",
              timeframe: "4h"
            }
          },
          {
            id: "2",
            content: "AAPL earnings report showed better than expected results",
            source: "article",
            metadata: {
              title: "AAPL Q2 Earnings"
            }
          }
        ]
      })
    };
  },
  
  // Mock response for add_to_brain2
  add_to_brain2: async () => {
    return {
      json: async () => ({
        id: `item-${Date.now()}`,
        status: "success",
        timestamp: new Date().toISOString(),
        message: "Content added to your knowledge store"
      })
    };
  },
  
  // Mock response for create_category
  create_category: async () => {
    return {
      json: async () => ({
        id: `category-${Date.now()}`,
        status: "success"
      })
    };
  }
};

export default mockBrain;
