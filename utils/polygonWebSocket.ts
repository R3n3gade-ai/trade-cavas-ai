// Mock implementation of the Polygon WebSocket API
// This is a temporary solution until we have a real implementation

// Mock data for options chain
interface OptionData {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
  optionType: string;
  strike: number;
  expiration: string;
}

class PolygonOptionsWebSocket {
  private callback: ((data: any) => void) | null = null;
  private symbol: string = '';
  private connected: boolean = false;
  private dataSimulationTimeout: ReturnType<typeof setTimeout> | null = null;

  // Connect to the WebSocket
  connect(symbol: string, callback: (data: any) => void): boolean {
    this.symbol = symbol;
    this.callback = callback;
    this.connected = true;

    // Simulate a successful connection
    console.log(`[Mock] Connected to Polygon WebSocket for ${symbol}`);

    // Notify the callback of the connection status
    if (this.callback) {
      this.callback({
        type: 'status',
        status: 'connected',
        message: `Connected to Polygon WebSocket for ${symbol}`
      });
    }

    // Start simulating data
    this.simulateData();

    return true;
  }

  // Disconnect from the WebSocket
  disconnect(): boolean {
    console.log('[Mock] Disconnected from Polygon WebSocket');

    // Clear any pending simulated data
    if (this.dataSimulationTimeout) {
      clearTimeout(this.dataSimulationTimeout);
      this.dataSimulationTimeout = null;
    }

    // Reset state
    this.connected = false;
    this.symbol = '';
    this.callback = null;

    return true;
  }

  // Check if connected
  isConnected(): boolean {
    return this.connected;
  }

  // Simulate receiving data from the WebSocket
  private simulateData(): void {
    if (!this.callback || !this.connected) return;

    // Generate random option data
    const optionTypes = ['call', 'put'];
    const strikes = [
      Math.floor(Math.random() * 10) + 440,
      Math.floor(Math.random() * 10) + 450,
      Math.floor(Math.random() * 10) + 460
    ];
    const expirations = [
      '2023-06-16',
      '2023-06-23',
      '2023-06-30'
    ];

    // Simulate data every 5 seconds
    this.dataSimulationTimeout = setTimeout(() => {
      const optionType = optionTypes[Math.floor(Math.random() * optionTypes.length)];
      const strike = strikes[Math.floor(Math.random() * strikes.length)];
      const expiration = expirations[Math.floor(Math.random() * expirations.length)];

      const data: OptionData = {
        symbol: `O:${this.symbol}${expiration.replace(/-/g, '')}${optionType === 'call' ? 'C' : 'P'}${strike}000`,
        price: Math.random() * 5,
        size: Math.floor(Math.random() * 100) + 1,
        timestamp: Date.now(),
        optionType,
        strike,
        expiration
      };

      this.callback(data);

      // Continue simulating data
      this.simulateData();
    }, 5000);
  }
}

// Create a singleton instance
const polygonWebSocket = new PolygonOptionsWebSocket();

export default polygonWebSocket;
