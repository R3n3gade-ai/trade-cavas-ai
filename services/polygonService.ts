export class PolygonService {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getStockAggregates(
    ticker: string,
    multiplier: number,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
    from: string,
    to: string
  ) {
    const url = `${this.baseUrl}/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apiKey=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async searchTickers(query: string) {
    const url = `https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&sort=ticker&order=asc&limit=10&apiKey=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to search tickers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  }
} 