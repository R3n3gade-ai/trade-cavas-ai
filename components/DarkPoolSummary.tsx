import React from 'react';
import { useDarkPoolStore } from '../utils/darkPoolStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DarkPoolSummary: React.FC = () => {
  const { darkPoolSummary, isLoading } = useDarkPoolStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!darkPoolSummary) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No dark pool summary data available.
      </div>
    );
  }
  
  // Prepare data for exchange volume chart
  const exchangeVolumeData = darkPoolSummary.volumeByExchange.map(item => ({
    name: item.exchange,
    value: parseFloat(item.volume.replace(/[^0-9.]/g, '')),
    percentage: item.percentage
  }));
  
  // Prepare data for hourly volume chart
  const hourlyVolumeData = darkPoolSummary.volumeByHour.map(item => ({
    name: item.hour,
    volume: parseFloat(item.volume.replace(/[^0-9.]/g, '')),
    percentage: parseFloat(item.percentage.replace('%', ''))
  }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-background/40 p-4 border-b border-white/10">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{darkPoolSummary.ticker}</span>
            <span className="text-2xl font-bold">Dark Pool Summary</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Summary Stats */}
        <div className="bg-card rounded-lg p-5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
              <div className="text-xl font-bold">{darkPoolSummary.totalVolume}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Dark Pool %</div>
              <div className="text-xl font-bold">{darkPoolSummary.darkPoolPercentage}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Block Trades</div>
              <div className="text-xl font-bold">{darkPoolSummary.blockTradeCount}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Dark Pool Trades</div>
              <div className="text-xl font-bold">{darkPoolSummary.darkPoolCount}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Largest Trade</h4>
            <div className="bg-background/40 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Value</div>
                  <div className="text-md font-bold">{darkPoolSummary.largestTrade.value}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                  <div className="text-md font-bold">{darkPoolSummary.largestTrade.shares}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Price</div>
                  <div className="text-md font-bold">{darkPoolSummary.largestTrade.price}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="text-md font-bold">{darkPoolSummary.largestTrade.time}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground">Type</div>
                <div className={`text-md font-bold ${darkPoolSummary.largestTrade.type === 'BLOCK' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {darkPoolSummary.largestTrade.type}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exchange Volume Pie Chart */}
        <div className="bg-card rounded-lg p-5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Volume by Exchange</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exchangeVolumeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage})`}
                >
                  {exchangeVolumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value}M (${props.payload.percentage})`, name]}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Hourly Volume Bar Chart */}
        <div className="bg-card rounded-lg p-5 border border-white/10 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Volume by Hour</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyVolumeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  formatter={(value) => [`${value}M`, 'Volume']}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                />
                <Bar dataKey="volume" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
