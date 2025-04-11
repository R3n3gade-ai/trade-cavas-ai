import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import TradingChart from '../components/TradingChart';

const Charts: React.FC = () => {
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div className="h-full w-full">
        <TradingChart
          symbol="BTC"
          interval="1D"
          theme="dark"
          height="100%"
          width="100%"
        />
      </div>
    </DashboardLayout>
  );
};

export default Charts;
