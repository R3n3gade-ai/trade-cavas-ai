import React, { useEffect } from 'react';
import { ChevronLeft, Brain, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { AddToBrain } from '../components/AddToBrain';
import { useDarkPoolStore } from '../utils/darkPoolStore';
import { DarkPoolFilters } from '../components/DarkPoolFilters';
import { DarkPoolTradesTable } from '../components/DarkPoolTradesTable';
import { DarkPoolLevelsTable } from '../components/DarkPoolLevelsTable';
import { DarkPoolSummary } from '../components/DarkPoolSummary';
import { DarkPoolHeatmap } from '../components/DarkPoolHeatmap';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const DarkPool: React.FC = () => {
  const navigate = useNavigate();
  
  const { 
    fetchAllData, 
    activeTab, 
    setActiveTab,
    selectedTicker,
    lastUpdated
  } = useDarkPoolStore();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  return (
    <DashboardLayout title="Dark Pool">
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
            <h2 className="text-2xl font-bold mr-3">Dark Pool</h2>
            {selectedTicker !== 'ALL' && (
              <div className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-md">
                {selectedTicker}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded flex items-center gap-1.5 hover:bg-primary/30 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const content = `Dark pool data for ${selectedTicker === 'ALL' ? 'all symbols' : selectedTicker} as of ${lastUpdated ? lastUpdated.toLocaleString() : 'now'}`;
                document.querySelector('[data-add-to-brain]')?.click();
              }}
            >
              <Brain className="h-4 w-4" />
              Add to Ted's Brain
            </button>
            <div className="hidden">
              <AddToBrain
                content={`Dark pool data for ${selectedTicker === 'ALL' ? 'all symbols' : selectedTicker} as of ${lastUpdated ? lastUpdated.toLocaleString() : 'now'}`}
                source="dark-pool-data"
                metadata={{ symbol: selectedTicker, date: lastUpdated?.toISOString() }}
                data-add-to-brain
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <Tabs defaultValue="trades" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="w-full border-b border-white/10 rounded-none bg-background/40 p-0">
                  <TabsTrigger 
                    value="trades" 
                    className="flex-1 rounded-none data-[state=active]:bg-background/0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                  >
                    Trades
                  </TabsTrigger>
                  <TabsTrigger 
                    value="levels" 
                    className="flex-1 rounded-none data-[state=active]:bg-background/0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                  >
                    Price Levels
                  </TabsTrigger>
                  <TabsTrigger 
                    value="summary" 
                    className="flex-1 rounded-none data-[state=active]:bg-background/0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="heatmap" 
                    className="flex-1 rounded-none data-[state=active]:bg-background/0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                  >
                    Heatmap
                  </TabsTrigger>
                </TabsList>
                
                <DarkPoolFilters />
                
                <TabsContent value="trades" className="m-0">
                  <DarkPoolTradesTable />
                </TabsContent>
                
                <TabsContent value="levels" className="m-0">
                  <DarkPoolLevelsTable />
                </TabsContent>
                
                <TabsContent value="summary" className="m-0">
                  <DarkPoolSummary />
                </TabsContent>
                
                <TabsContent value="heatmap" className="m-0">
                  <DarkPoolHeatmap />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {/* Dark Pool Information Card */}
            <Card className="p-5 border border-white/10 mb-6">
              <h3 className="text-lg font-semibold mb-4">About Dark Pools</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Dark pools are private exchanges where financial assets and securities are traded and matched. Unlike traditional exchanges, dark pools are not accessible to the investing public.
                </p>
                <div className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Institutional Trading</h4>
                    <p>Dark pools are used by large institutions to buy and sell large blocks of securities without impacting the market price.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Price Discovery</h4>
                    <p>Trades executed in dark pools do not display bid/ask quotes to the public, which can affect price discovery in the market.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Market Impact</h4>
                    <p>By analyzing dark pool activity, traders can gain insights into institutional positioning and potential price movements.</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Price Levels Information */}
            <Card className="p-5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Understanding Price Levels</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Price levels aggregate institutional-only volume by price points where trades have executed. Over time, levels grow and new levels are created.
                </p>
                <div className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Info className="h-3 w-3 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Highlighted Levels</h4>
                    <p>Purple highlighted levels indicate significant institutional interest, potentially acting as support or resistance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Info className="h-3 w-3 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Volume Concentration</h4>
                    <p>Higher percentages indicate price levels where institutions have concentrated their trading activity.</p>
                  </div>
                </div>
                <p className="text-xs mt-2">
                  Available for over 5,000 symbols across US equities markets.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DarkPool;
