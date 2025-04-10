import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

const DarkPoolSimple: React.FC = () => {
  return (
    <DashboardLayout title="Dark Pool">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dark Pool</h1>
        <p>This is a simplified version of the Dark Pool page.</p>
      </div>
    </DashboardLayout>
  );
};

export default DarkPoolSimple;
