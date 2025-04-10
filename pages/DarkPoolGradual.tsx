import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { useDarkPoolStore } from '../utils/darkPoolStore';
import { DarkPoolFilters } from '../components/DarkPoolFilters';
import { Card } from '@/components/ui/card';

const DarkPoolGradual: React.FC = () => {
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <DarkPoolFilters />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dark Pool Data</h3>
                <p>This is a gradual implementation of the Dark Pool page.</p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-5 border border-white/10 mb-6">
              <h3 className="text-lg font-semibold mb-4">About Dark Pools</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Dark pools are private exchanges where financial assets and securities are traded and matched. Unlike traditional exchanges, dark pools are not accessible to the investing public.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DarkPoolGradual;
