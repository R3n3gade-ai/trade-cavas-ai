import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertTriangle, ChevronLeft, Search, RefreshCw } from 'lucide-react';
import { polygonWebSocket } from '../services/polygon-service';
import OptionsFlow from '../components/OptionsFlow';
import useOptionsStore from '../utils/optionsStore';
import GammaExposureCharts from '../components/GammaExposureCharts';
import { Loader2, Brain } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { AddToBrain } from '../components/AddToBrain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "../utils/store";
import { Separator } from "@/components/ui/separator";
import { PolygonStockChart } from '../components/PolygonStockChart';
import { OptionsChain } from '../components/OptionsChain';
import { usePolygonStore } from '../utils/polygonStore';

const Options: React.FC = () => {
  const navigate = useNavigate();
  // View state (chain, flow, gamma)
  const [activeView, setActiveView] = useState<'chain' | 'flow' | 'gamma'>('chain');
  // State for the ticker input (using SPY as default)
  const [tickerInput, setTickerInput] = useState("SPY");
  const [currentTicker, setCurrentTicker] = useState("SPY");
  // State for chart timeframe
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M');

  const { sidebarOpen } = useDashboardStore();
  const { isWebSocketConnected } = usePolygonStore();

  const {
    selectedSymbol,
    availableSymbols,
    expirations,
    strikes,
    chain,
    selectedExpiration,
    underlyingPrice,
    isLoading,
    error,
    wsStatus,
    wsStatusMessage,
    setSelectedSymbol,
    setSelectedExpiration,
    fetchOptionsChain
  } = useOptionsStore();

  // Fetch initial options data when component mounts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize WebSocket connection
    if (wsStatus !== 'connected' && wsStatus !== 'connecting') {
      // Connect to WebSocket
      console.log('Connecting to WebSocket...');
    }

    // Fetch options chain for the default symbol
    fetchOptionsChain(selectedSymbol);

    // Cleanup function
    return () => {
      // Disconnect WebSocket if needed
      console.log('Disconnecting from WebSocket...');
    };
  }, []);

  // Update options chain when symbol changes
  useEffect(() => {
    if (selectedSymbol) {
      fetchOptionsChain(selectedSymbol);
    }
  }, [selectedSymbol, fetchOptionsChain]);

  // Helper function to format price
  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    return `$${price.toFixed(2)}`;
  };

  // Helper function to format change
  const formatChange = (change?: number) => {
    if (change === undefined) return '-';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  };

  // Handle chart analysis request
  const handleChartAnalysis = (chartUrl: string) => {
    // In a real app, this would send the chart to TedAI for analysis
    console.log('Analyzing chart:', chartUrl);
  };

  return (
    <DashboardLayout title="Options">
      <div className="flex items-center mb-6">
        <button
          className="flex items-center text-sm text-muted-foreground hover:text-white transition-colors mr-4"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold mr-3">Options</h2>
            {underlyingPrice && (
              <Badge variant="outline" className="px-3 py-1 text-xl border-primary/30 bg-primary/10">
                {selectedSymbol}: ${underlyingPrice.toFixed(2)}
              </Badge>
            )}
            <div className="ml-6 flex space-x-2">
              <button
                className={`px-3 py-1 rounded transition-colors ${activeView === 'chain' ? 'bg-primary text-white' : 'bg-card hover:bg-accent'}`}
                onClick={() => setActiveView('chain')}
              >
                Chain
              </button>
              <button
                className={`px-3 py-1 rounded transition-colors ${activeView === 'flow' ? 'bg-primary text-white' : 'bg-card hover:bg-accent'}`}
                onClick={() => setActiveView('flow')}
              >
                Flow
              </button>
              <button
                className={`px-3 py-1 rounded transition-colors ${activeView === 'gamma' ? 'bg-primary text-white' : 'bg-card hover:bg-accent'}`}
                onClick={() => setActiveView('gamma')}
              >
                Gamma
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded flex items-center gap-1.5 hover:bg-primary/30 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const content = `Options data for ${selectedSymbol} with expiration on ${selectedExpiration ? new Date(selectedExpiration).toLocaleDateString() : 'N/A'}`;
                document.querySelector('[data-add-to-brain]')?.click();
              }}
            >
              <Brain className="h-4 w-4" />
              Add to Ted's Brain
            </button>
            <div className="hidden">
              <AddToBrain
                content={`Options data for ${selectedSymbol} with expiration on ${selectedExpiration ? new Date(selectedExpiration).toLocaleDateString() : 'N/A'}`}
                source="options-data"
                metadata={{ symbol: selectedSymbol, expiration: selectedExpiration }}
                data-add-to-brain
              />
            </div>
            <div className="bg-card border border-white/10 rounded-md px-3 py-1 flex items-center">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                className="bg-transparent border-none focus:outline-none w-24 text-center"
                placeholder="Symbol"
              />
              <button
                className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                onClick={() => {
                  setCurrentTicker(tickerInput);
                  setSelectedSymbol(tickerInput);
                }}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {/* Stock Chart */}
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{currentTicker} Price Chart</CardTitle>
                <div className="flex space-x-1">
                  {['1D', '1W', '1M', '3M', '6M', '1Y'].map((tf) => (
                    <button
                      key={tf}
                      className={`px-2 py-1 text-xs rounded ${timeframe === tf ? 'bg-primary text-white' : 'bg-card hover:bg-accent'}`}
                      onClick={() => setTimeframe(tf as any)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PolygonStockChart
                ticker={currentTicker}
                timeframe={timeframe}
                height={300}
                showVolume={true}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="text-sm text-muted-foreground mr-1">Expirations:</div>
            {expirations.length > 0 ? (
              expirations.map(exp => {
                const isSelected = selectedExpiration === exp;
                const expDate = new Date(exp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                return (
                  <button
                    key={exp}
                    onClick={() => setSelectedExpiration(exp)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card/80 border-white/10 hover:border-primary/50'}`}
                  >
                    {expDate}
                  </button>
                );
              })
            ) : (
              <div className="text-muted-foreground italic">No expirations available</div>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-4 bg-red-900/20 border-red-800">
            <CardContent className="py-4">
              <div className="flex items-center text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'flow' && (
          <Card className="border border-white/10 bg-card/50 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Options Flow</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-muted-foreground">Calls</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-muted-foreground">Puts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-muted-foreground">Premium $1M+</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <OptionsFlow symbol={selectedSymbol} />
            </CardContent>
          </Card>
        )}

        {activeView === 'chain' && (
          <Card>
            <CardHeader className="pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold">{currentTicker} Options Chain</h3>
                    {/* WebSocket Connection Status */}
                    <div className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                      isWebSocketConnected ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {isWebSocketConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                      <span>
                        {isWebSocketConnected ? 'Data Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
                {underlyingPrice && (
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-card/50 text-white">
                      ${underlyingPrice.toFixed(2)}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Use our new OptionsChain component */}
              <OptionsChain ticker={currentTicker} />
            </CardContent>
          </Card>
        )}

        {activeView === 'gamma' && selectedExpiration && underlyingPrice && (
          <div className="mt-6">
            <GammaExposureCharts symbol={selectedSymbol} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Options;
