import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import StockChart from '../components/StockChart';

const Charts: React.FC = () => {
  return (
    <DashboardLayout title="Charts" showRefresh={false}>
      <div style={{ height: 'calc(100vh - 64px)', width: '100%', overflow: 'hidden' }}>
        <StockChart />
      </div>
    </DashboardLayout>
  );
};

export default Charts;
