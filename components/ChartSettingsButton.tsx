import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import ChartSettingsPanel from './ChartSettingsPanel';

const ChartSettingsButton: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className={`px-3 py-1.5 rounded-md border flex items-center space-x-1.5 ${
          isSettingsOpen ? 'bg-primary border-primary' : 'bg-card border-white/10 hover:bg-card/70'
        }`}
        aria-label="Chart Settings"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>
      
      <ChartSettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default ChartSettingsButton;
