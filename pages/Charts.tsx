import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import StockChart from '../components/StockChart';
import TickerSearch from '../components/TickerSearch';
import { PolygonService } from '../services/polygonService';
import { POLYGON_CONFIG } from '../config/polygonConfig';
import { Box } from '@mui/material';

const Charts: React.FC = () => {
  const [stockData, setStockData] = useState<[number, number, number, number, number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const polygonService = new PolygonService(POLYGON_CONFIG.API_KEY);

  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 500);

      const response = await polygonService.getStockAggregates(
        symbol,
        1,
        'day',
        thirtyDaysAgo.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );

      const formattedData = response.results.map(data => [
        data.t,
        data.o,
        data.h,
        data.l,
        data.c,
        data.v
      ]);

      setStockData(formattedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stock data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(selectedSymbol);
  }, [selectedSymbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <Box sx={{ p: 2 }}>
        <TickerSearch
          value={selectedSymbol}
          onChange={setSelectedSymbol}
          label="Search Ticker"
          placeholder="Enter ticker symbol or company name"
          sx={{ mb: 2 }}
        />
        <Box sx={{ height: '100%' }}>
          <StockChart 
            symbol={selectedSymbol} 
            data={stockData}
            onSymbolChange={setSelectedSymbol}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Charts;
