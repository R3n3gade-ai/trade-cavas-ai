import axios from 'axios';

interface StockAggregatesResponse {
  results: Array<{
    t: number; // timestamp
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    v: number; // volume
  }>;
  status: string;
  request_id: string;
  count: number;
}

export class PolygonService {
  private baseUrl = 'https://api.polygon.io';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: {
          ...params,
          apiKey: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Polygon API Error:', error);
      throw error;
    }
  }

  // Get stock aggregates (bars)
  async getStockAggregates(
    ticker: string,
    multiplier: number,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
    from: string,
    to: string,
    adjusted: boolean = true
  ): Promise<StockAggregatesResponse> {
    return this.makeRequest<StockAggregatesResponse>(`/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`, {
      adjusted: adjusted.toString()
    });
  }

  // Get previous day's close
  async getPreviousClose(ticker: string, adjusted: boolean = true) {
    return this.makeRequest(`/v2/aggs/ticker/${ticker}/prev`, {
      adjusted: adjusted.toString()
    });
  }

  // Get stock details
  async getStockDetails(ticker: string) {
    return this.makeRequest(`/v3/reference/tickers/${ticker}`);
  }
} 