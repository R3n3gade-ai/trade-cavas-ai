import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

const BasicDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard" showRefresh={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-white/10">
          <h2 className="text-xl font-bold mb-4">Market Overview</h2>
          <p className="text-muted-foreground mb-4">
            View the latest market trends and indicators.
          </p>
          <div className="h-40 bg-background/50 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Market data visualization will appear here</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-white/10">
          <h2 className="text-xl font-bold mb-4">Portfolio</h2>
          <p className="text-muted-foreground mb-4">
            Track your investments and performance.
          </p>
          <div className="h-40 bg-background/50 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Portfolio data will appear here</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-white/10">
          <h2 className="text-xl font-bold mb-4">AI Insights</h2>
          <p className="text-muted-foreground mb-4">
            Get AI-powered trading recommendations.
          </p>
          <div className="h-40 bg-background/50 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">AI insights will appear here</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card p-6 rounded-lg shadow-sm border border-white/10">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-background/50 rounded-md">
              <p className="text-muted-foreground">Activity item {item}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BasicDashboard;
