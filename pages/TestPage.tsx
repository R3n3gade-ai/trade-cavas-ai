import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

const TestPage: React.FC = () => {
  return (
    <DashboardLayout title="Test Page">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p>This is a simple test page to check if routing is working correctly.</p>
      </div>
    </DashboardLayout>
  );
};

export default TestPage;
