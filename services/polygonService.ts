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
    // Add limit parameter for minute data to ensure we get enough data points
    let limit = '';
    if (timespan === 'minute') {
      // For minute data, we need to ensure we get enough data points
      // Polygon API default limit is 5000, which should be enough for most cases
      limit = '&limit=5000';
    }

    const url = `${this.baseUrl}/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true${limit}&apiKey=${this.apiKey}`;

    console.log('Polygon API URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polygon API error:', errorText);
      throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Polygon API response status:', data.status);
    console.log('Polygon API response count:', data.resultsCount);

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